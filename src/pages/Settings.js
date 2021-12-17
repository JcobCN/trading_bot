import React, { useState, useEffect, useRef } from "react";

import { Button, FormControl } from "react-bootstrap";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { MDBDataTableV5 } from "mdbreact";
import Web3 from "web3";
import {
  getMainSettings, setMainSettings,
  addWallet, listWallets, deleteWallet, addWalletFromFile,
  detailWallet, 
  resetAllAPI
} from "../api";
import CONFIG from "../constant/config";

/**
 * UI module for handling Settings. 
 * Directly call Backend API for settings, - no more than this.
 * @returns 
 */
const Settings = () => {

  const [tokenAddr, setTokenAddr] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [mainWalletAddr, setMainWalletAddr] = useState("");
  const [mainPrivateKey, setMainPrivateKey] = useState("");

  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const [wallets, setWallets] = useState([]);

  const fileRef = useRef();

  const resetAll = () => {
    resetAllAPI();
  };

  console.log(wallets);

  var rows = wallets.map((item) => {
    item.addressHash = (
      <a
        href={CONFIG.EXPLORER_ADDR + item.address}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.address}
      </a>
    );

    item.actions = (
      <div>
        <Button
          variant="info"
          size="sm"
          onClick={() => detail_Wallet(item.address)}
        >
          Detail
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => delete_Wallet(item.address)}
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
        field: "addressHash",
      },
      {
        label: "Actions",
        field: "actions",
      },
    ],
    rows: rows,
  };

  const delete_Wallet = (wallet) => {
    deleteWallet(wallet);
    let newWallets = wallets.filter(function (obj) {
      return obj.address !== wallet;
    });
    setWallets(newWallets);
  };

  const detail_Wallet = async (address) => {
    detailWallet(address);
  }

  const add_Wallet = async (_address, _privateKey) => {
    let address = Web3.utils.toChecksumAddress(_address);
    let newWallets = [
      ...wallets,
      {
        address: address,
      },
    ];
    setWallets(newWallets);
    addWallet(address, _privateKey);
    setAddress("");  // TODO Check
    setPrivateKey("");
  };

  const list_Wallets = async () => {
    let items = await listWallets();
    if(items !== undefined)
      setWallets(items);
  };

  const load_MainSettings = async () => {
    let settings = await getMainSettings();
  }

  const upload_wallet_file = async (uploadFile) => {
    addWalletFromFile(uploadFile);
  }

  const load_file = () => {
    fileRef.current.click();
  }

  const SettingHelp = () => {
    return (
      <div>
        <h3>
          Trading Bot Help
        </h3>
        <p>Please give the Main wallet information here.</p>
        <p>This wallet holds the BNB and Token</p>
        <p>It will send BNB to the work wallets for BUY operation. </p>
        <p> Once the bot starts, the work wallets will accept the BNB and BUY the given token.</p>

        <div>
          <p> The bot operations would be </p>
          <p>For BUY operation : </p>
          <ul>
            <li>Distribute BNB from main wallet to the work wallets.</li>
            <li>Run BUY operation for each wallets. (Buy Token with BNB)</li>
            <li>Gather swapped tokens to the main wallet.</li>
          </ul>
          <p> For SELL operation : </p>
          <ul>
            <li>Distribute Token from main wallet to the work wallets.</li>
            <li>Run SELL operation for each wallets. (Sell Token for BNB)</li>
            <li>Gather swapped BNBs to the main wallet.</li>
          </ul>
        </div>
      </div>
    );
  }
  const MainWallet = () => {
    return (
      <div className="px-2 py-2 my-2" >
        <h3>
          Setup Main wallet information
        </h3>
        <div className="row">
          <div className="col-sm-12 col-md-10">
            <div className="border border-primary px-2 py-2 my-2 col-sm-12 col-md-12" >
              <div className="row" id="token_address">
                <div className="form-group col-sm-12 col-md-12">
                  <label htmlFor="tokenAddr">Token Address:</label>
                  <FormControl
                    type="text"
                    id="tokenAddr"
                    value={tokenAddr}
                    onChange={(e) => {
                      setTokenAddr(e.target.value);
                    }}
                    className="form-control form-control-md"
                  />
                </div>
              </div>
              <div className="row" id="token_information">
                <div className="form-group col-sm-12 col-md-6">
                  <label htmlFor="tokenName">Token Name:</label>
                  <FormControl
                    type="text"
                    id="tokenName"
                    value={tokenName}
                    onChange={(e) => {
                      setTokenName(e.target.value);
                    }}
                    className="form-control form-control-md"
                  />
                </div>
                <div className="form-group col-sm-12 col-md-6">
                  <label htmlFor="tokenSymbol">Token Symbol:</label>
                  <FormControl
                    type="text"
                    id="tokenSymbol"
                    value={tokenSymbol}
                    onChange={(e) => {
                      setTokenSymbol(e.target.value);
                    }}
                    className="form-control form-control-md"
                  />
                </div>
              </div>
            </div>

            <div className="border border-primary px-2 py-2 my-2 col-sm-12 col-md-12">
              <div className="row">  
                <div className="form-group col-sm-12 col-md-6">
                  <label htmlFor="usr">Main Wallet Address:</label>
                  <FormControl
                    type="text"
                    id="mainWalletAddr"
                    value={mainWalletAddr}
                    onChange={(e) => {
                      setMainWalletAddr(e.target.value);
                    }}
                    className="form-control form-control-md"
                  />
                </div>
                <div className="form-group col-sm-12 col-md-6">
                  <label htmlFor="pwd">Private Key:</label>
                  <FormControl
                    type="password"
                    id="mainPrivateKey"
                    value={mainPrivateKey}
                    onChange={(e) => {
                      setMainPrivateKey(e.target.value);
                    }}
                    className="form-control form-control-md"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-group col-sm-12 col-md-2">
              <div className="d-flex align-items-end h-100">
                <Button
                  className="btn_save_main"
                  onClick={(e) => setMainSettings(
                          mainWalletAddr, mainPrivateKey, 
                          tokenAddr, tokenName, tokenSymbol)}
                >
                  Set
                </Button>
              </div>
          </div>
        </div>

        <SettingHelp />
      </div>
    );
  }

  const WorkWallets = () => {
    

    return (
      <div className="border border-primary px-2 py-2 my-2" >
        <div className="row" id="add_wallet">
          <div className="form-group col-sm-12 col-md-10">
            <h3>
              Trading Work Wallet List
            </h3>
          </div>

          <div className="form-group col-sm-12 col-md-2">
            <div className="d-flex align-items-end">
              <Button
                variant="warning"
                size="md"
                onClick={() => load_file()}>
                Load File
              </Button>
              <input
                hidden
                type="file"
                ref={fileRef}
                onChange={(e) => upload_wallet_file(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row" id="add_wallet">
          <div className="form-group col-sm-12 col-md-5">
            <label htmlFor="address">Wallet Address:</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              className="form-control form-control-md"
            />
          </div>

          <div className="form-group col-sm-12 col-md-5">
            <label htmlFor="privateKey">Private Key:</label>
            <input
              type="password"
              id="privateKey"
              value={privateKey}
              onChange={(e) => {
                setPrivateKey(e.target.value);
              }}
              className="form-control form-control-md"
            />
          </div>
          <div className="form-group col-sm-12 col-md-1">
            <div className="d-flex align-items-end h-100">
              <Button
                variant="primary"
                size="md"
                onClick={() => add_Wallet(address, privateKey)}>
                +
              </Button>
            </div>
          </div>
        </div>

        <div className="col-sm-12 col-md-12 col-lg-12">
          <MDBDataTableV5 hover data={data} />
        </div>
      </div>
    );
  }

  const ResetSettings = () => {
    return (
      <div id="resetAll">
  
        <div className="row form-group">
          <p>
            Init all of the data including Main Wallet Information and Work Wallets.
          </p>
        </div>
  
        <div className="row form-group">
          <Button variant="danger" className="setting-btn" onClick={() => resetAll()}>
            Init All
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div>

      <Tabs defaultActiveKey="mainwallet" id="setting-tab" className="mb-3"
        onSelect={ (curIndex, lastIndex) => { 
          if(curIndex === lastIndex) 
            return;
          if(curIndex == 0) {
            load_MainSettings();
          } else if (curIndex == 1) {
            list_Wallets();
          }
        }}
      >
        <Tab eventKey="mainwallet" title="Main Wallet">
          <MainWallet />
        </Tab>
        <Tab eventKey="wallet" title="Work Wallet">
          <WorkWallets />
        </Tab>
        <Tab eventKey="reset" title="Reset">
          <ResetSettings />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Settings;
