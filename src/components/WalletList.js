import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { MDBDataTableV5 } from "mdbreact";
import "./tokenList.css";
import { addToken, deleteToken, listTokens } from "./api";
import Web3 from "web3";
import CONFIG from "./constant/config";

/** 
 * Browse the Wallet List that we monitor.
 * Can ADD / REMOVE / BROWSE
 * Check each wallet in Ethscan.  
 * 
 * IMPORTANT : We should handle BSC wallet as well. 
 * Token should have network identifier as well. So, Token data structure should be changed.
 * We should change ethscan to bscscan for Bsc wallets.
 */
const TokenList = () => {

  const [tokens, setTokens] = useState([]);
  const [address, setAddress] = useState([]);

  /** 
   * wallet handler : Open in the Ethscan, or in the BSCscan.
   */  
  var rows = tokens.map((item) => {
    item.actions = (
      <div>
        <a
          href={CONFIG.EXPLORER_ADDR + item.address}
          target="_blank"  rel="noopener noreferrer"
        >
          <Button variant="success" size="sm" className="check-token">
            Check
          </Button>
        </a>
        <Button
          variant="danger"
          size="sm"
          onClick={() => del_Token(item.address)}
        >
          Delete
        </Button>
      </div>
    );

    return item;
  });

  const data = {
    columns: [
      {
        label: "Address",
        field: "address",
      },
      {
        label: "Actions",
        field: "actions",
      },
    ],
    rows: rows,
  };

  /**
   * Remove the wallet from the list and refresh the list
   * @param {String} address 
   */
  const del_Token = (address) => {
    deleteToken(address);
    let newTokens = tokens.filter(function(obj) {
      return obj.address !== address;
    });
    setTokens(newTokens);
  };

  /**
   * Add Wallet to the token List
   * 1) Convert given upper/lower case address to ChecksumAddress that blockchain uses.
   * 2) Add the new wallet address to the address list to show user.
   * 3) Issue AddToken API to the backend.
   * @param {String} _address 
   */
  const add_Token = async (_address) => {
    let address = Web3.utils.toChecksumAddress(_address);
    let newTokens = [
      ...tokens,
      {
        address: address,
      },
    ];
    setTokens(newTokens);
    addToken(address);
    setAddress("");
  };

  const list_Tokens = async () => {
    let items = await listTokens();
    setTokens(items);
  };

  // This method is called with the page open.
  // Get the toke List from backend API.
  useEffect(() => {
    list_Tokens();
  }, []);

  return (
    <div>
      <div className="col-sm-12 col-md-12 col-lg-12 ">
        <label htmlFor="usr">Wallet Address:</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
          className="medium-input"
        />

        <Button variant="primary" size="md" onClick={() => add_Token(address)}>
          Add Wallet
        </Button>
      </div>

      <div className="col-sm-12 col-md-12 col-lg-12">
        <MDBDataTableV5 hover data={data} />
      </div>
    </div>
  );
};

export default TokenList;
