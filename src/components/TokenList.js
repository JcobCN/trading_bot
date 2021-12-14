import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { MDBDataTableV5 } from "mdbreact";
import "./tokenList.css";
import { addBlackToken, deleteBlackToken, listBlackTokens } from "./api";
import Web3 from "web3";
import CONFIG from "./constant/config";
import { abi } from "./constant/abi";

/** 
 * Browse the Black Token List that we monitor.
 * Can ADD / REMOVE / BROWSE
 * Check each wallet in Ethscan.  
 * 
 * This is copy-paste of WalletList.js
 * So, we should introduce modified token data structure.
 * 
 */
const TokenList = () => {
  const wssWeb3 = new Web3(
    new Web3.providers.WebsocketProvider(CONFIG.NODE_URL)
  );

  const [tokens, setTokens] = useState([]);
  const [address, setAddress] = useState([]);

  var rows = tokens.map((item) => {
    item.actions = (
      <div>
        <Button
          variant="outline-danger"
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
        label: "Token Name",
        field: "name",
      },

      {
        label: "Symbol",
        field: "symbol",
      },
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

  const del_Token = (address) => {
    deleteBlackToken(address);
    let newTokens = tokens.filter(function(obj) {
      return obj.address !== address;
    });
    setTokens(newTokens);
  };

  const add_Token = async (address) => {
    
    address = Web3.utils.toChecksumAddress(address);
    let tokenContract = new wssWeb3.eth.Contract(abi, address);
    let name = await tokenContract.methods.name().call();
    let symbol = await tokenContract.methods.symbol().call();
    let newTokens = [
      ...tokens,
      {
        name: name,
        symbol: symbol,
        address: address,
      },
    ];
    setTokens(newTokens);
    addBlackToken(name, symbol, address);
    setAddress('');
  };

  const list_Tokens = async () => {
    let items = await listBlackTokens();
    setTokens(items);
  };

  useEffect(() => {
    list_Tokens();
  }, []);

  return (
    <div>
      <div className="col-sm-12 col-md-12 col-lg-12 ">
        <label htmlFor="usr">Token Address:</label>
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
          Add Token
        </Button>
      </div>

      <div className="col-sm-12 col-md-12 col-lg-12">
        <MDBDataTableV5  hover data={data} />
      </div>
    </div>
  );
};

export default TokenList;
