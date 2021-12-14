import React, { useState, useEffect } from "react";
import { Button, FormControl } from "react-bootstrap";
import "./Display.css";
import { MDBDataTable } from "mdbreact";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { startFront, stopFront, getFrontStatus, listFront } from "./api";
import CONFIG from "./constant/config";

/**
 * Basic UI module for handling Bot Operation.
 * Detailed comments are seen below.
*/

const FrontRun = () => {
  const client = new W3CWebSocket("ws://localhost:8080/connect");

  var transactionItems = [];

  // Data Storages for app work. 
  const [isRunning, setIsRunning] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [safetyWallet, setSafetyWallet] = useState("");
  const [nodeUrl, setNodeUrl] = useState("");
  const [network, setNetwork] = useState("");
  const [slippage, setSlippage] = useState("");
  const [minBNB, setMinBNB] = useState("");
  const [maxBNB, setMaxBNB] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [gasSetting, setGasSetting] = useState("native");

  var rows = transactions.map((item) => {
    item.transaction = (
      <a href={CONFIG.EXPLORER + item.transaction} target="_blank" rel="noopener noreferrer">
        {item.transaction}
      </a>
    );

    return item;
  });

  const data = {
    columns: [
      {
        label: "TimeStamp",
        field: "timestamp",
      },

      {
        label: "Token",
        field: "token",
      },
      {
        label: "Buy/Sell",
        field: "action",
      },
      // {
      //   label: "Price",
      //   field: "price",
      // },

      {
        label: "Transaction",
        field: "transaction",
      },
    ],
    rows: rows,
  };

  // Run the backend bot by pressing "Start Bot" toggle button.
  const start = () => {
    if (
      nodeUrl === "" ||
      walletAddress === "" ||
      privateKey === "" ||
      slippage === "" ||
      minBNB === "" ||
      maxBNB === ""
    ) {
      alert("please input all information to start wallet tracking !");
    } else {
      setIsRunning(true);
      startFront(
        nodeUrl, network,
        walletAddress, privateKey,
        safetyWallet,
        slippage,
        minBNB, maxBNB,
        gasSetting
      );
    }
  };

  // Stop the Bot as pressing "Stop Bot" toggle button  
  const stop = () => {
    setIsRunning(false);
    stopFront();
  };

  // Load Settings from the backend database
  // The UI fields accepts the setting values to show in their boxes.

  const loadSetting = (status) => {
    setWalletAddress(status.wallet);
    setPrivateKey(status.key);
    setNodeUrl(status.node);
    setNetwork(status.network);
    setSafetyWallet(status.safetyWallet);
    setSlippage(status.slippage);
    setMinBNB(status.minbnb);
    setMaxBNB(status.maxbnb);
    setGasSetting(status.gasSetting);
  };


  const setStatus = async () => {
    var curStatus = await getFrontStatus();
    console.log(curStatus);
    loadSetting(curStatus);
    if (curStatus.status === "1") setIsRunning(true);
    else setIsRunning(false);
  };

  /**
   * Get the transactions from server to show the list.
   * Actions for the list : Check from eth/bsc scan.
   */
  const listTransactions = async () => {
    transactionItems = await listFront();
    setTransactions(transactionItems);
  };

  /**
   * On loading 
   * Get the status(parameters) of the app.
   * Get the list of the transactions 
   * to show to the UI.
   */
  useEffect(() => {
    setStatus();
    listTransactions();
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      if (message.data.includes("front")) listTransactions();
      if (message.data.includes("setting")) {
        setStatus();
        listTransactions();
      }
    };
  }, []);

  /**
   * Show UI frame. 
   * For entering the bot parameters.
   *     Viewing the list of the transactions. 
   */
  return (
    <div>
      <div className="row">
        <div className="form-group col-sm-12 col-md-6">
          <label htmlFor="usr">Wallet Address:</label>
          <FormControl
            type="text"
            id="walletAddr"
            value={walletAddress}
            onChange={(e) => {
              setWalletAddress(e.target.value);
            }}
            className="form-control form-control-md"
          />
        </div>

        <div className="form-group col-sm-12 col-md-6">
          <label htmlFor="pwd">Private Key:</label>
          <FormControl
            type="password"
            id="privateKey"
            value={privateKey}
            onChange={(e) => {
              setPrivateKey(e.target.value);
            }}
            className="form-control form-control-md"
          />
        </div>
      </div>
      <div className="row">
        <div className="form-group col-sm-12 col-md-6">
          <label htmlFor="safetyWallet">Safety Wallet:</label>
          <FormControl
            type="text"
            id="safetyWallet"
            value={safetyWallet}
            onChange={(e) => {
              setSafetyWallet(e.target.value);
            }}
            className="form-control form-control-md"
          />
        </div>
      </div>

      <div className="row">
        <div className="form-group col-sm-12 col-md-6">
          <label htmlFor="wssURL">Quick Node WSS URL:</label>
          <FormControl
            type="text"
            id="nodeUrl"
            value={nodeUrl}
            onChange={(e) => {
              setNodeUrl(e.target.value);
            }}
            className="form-control form-control-md"
          />
        </div>

        <div className="form-group col-sm-12 col-md-6">
          <label htmlFor="network">Select Network:</label>
          <div className="form-group col-sm-12 col-md">
            <input className="mr-4"
              type="radio" value="Ethereum" name="network"
              checked={network === "Ethereum"}
              onChange={(e) => { setNetwork("Ethereum"); }}
            /><span className="mr-4">Ethereum</span>
            <input className="mr-4"
              type="radio" value="Binance" name="network"
              checked={network === "Binance"}
              onChange={(e) => { setNetwork("Binance"); }}
            /> <span className="mr-4">Binance</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="form-group col-sm-12 col-md-4">
          <label htmlFor="pwd">Slippage(%):</label>
          <input
            type="number"
            id="slippage"
            className="short-input"
            value={slippage}
            onChange={(e) => {
              setSlippage(e.target.value);
            }}
          />
        </div>
        <div className="form-group col-sm-12 col-md-4">
          <label htmlFor="pwd">Min Amount:</label>
          <input
            type="number"
            id="minBNB"
            className="short-input"
            value={minBNB}
            onChange={(e) => {
              setMinBNB(e.target.value);
            }}
          />
        </div>
        <div className="form-group col-sm-12 col-md-4">
          <label htmlFor= "pwd">Max Amount:</label>
          <input
            type="number"
            id="maxBNB"
            className="short-input"
            value={maxBNB}
            onChange={(e) => {
              setMaxBNB(e.target.value);
            }}
          />
        </div>
      </div>

      <span className="section_gasSetting">
        <label htmlFor="pwd" className="section_gasSetting_title">
          Gas Setting:&nbsp;{" "}
        </label>
        <span className="section_gasSetting_radio">
          <label>
            <input
              type="radio"
              value="native"
              checked={gasSetting === "native"}
              onChange={(e) => {
                setGasSetting("native");
              }}
            />
            &nbsp; Block Native
          </label>
          <label>
            <input
              type="radio"
              value="mm"
              checked={gasSetting === "mm"}
              onChange={(e) => {
                setGasSetting("mm");
              }}
            />
            &nbsp; MM Recommended Gas
          </label>
        </span>
        <Button
          variant={isRunning ? "danger" : "primary"}
          className="btn_start"
          onClick={isRunning ? () => stop() : () => start()}
        >
          {isRunning ? "Stop Bot" : "Start Bot"}
        </Button>
      </span>

      <MDBDataTable hover data={data} />
    </div>
  );
};

export default FrontRun;
