import React, { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar'
import { confirmAlert } from "react-confirm-alert";
import { Button } from "react-bootstrap";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { startBot, stopBot, getBotStatus } from "../api";

import 'react-confirm-alert/src/react-confirm-alert.css';

/**
 * Basic UI module for handling Buy Bot Operation.
 * Detailed comments are seen below.
*/
const Bot = (props) => {
  // Socket to check progress of the Bot.
  // const client = new W3CWebSocket("ws://localhost:8080/connect");

  var transactionItems = [];

  // Data Storages for app work. 
  const transKind = props.transKind;

  const [totalWalletCount, setTotalWalletCount] = useState(0);
  const [processedWalletCount, setProcessedWalletCount] = useState(0);
  const [tokenInfo, setTokenInfo] = useState({name:"", abbr:""});

  const [mainBnbAmount, setMainBnbAmount] = useState(0);
  const [mainTokenAmount, setMainTokenAmount] = useState(0);
  const [tradeBnb, setTradeBnb] = useState(0);

  const [mainWalletAddress, setMainWalletAddress] = useState("");
  const [runningStatus, setRunningStatus] = useState("stop");

  const confirmStopBot = (message) => {
    var selected = false;
    confirmAlert({
      title: 'Confirm to Stop Bot',
      message: message,
      buttons: [
        {
          label: 'Yes',
          onClick: () => selected = true
        },
        {
          label: 'No',
          onClick: () => selected = false
        }
      ]
    });

    return selected;
  }
  
  // Run the backend bot by pressing "Start Bot" toggle button.
  const start = () => {
    if(runningStatus !== "stop") {  
      if (confirmStopBot(runningStatus 
                + " Bot is running. \n Will you stop it and start "
                 + transKind + "Bot?") )
        stopBot();
      else  {
        // TODO Should move page for current Bot Activity
        return;
      }
    }    
    startBot(transKind);
  };

  // Stop the Bot as pressing "Stop Bot" toggle button  
  const stop = () => {
    stopBot();
  };


  // Load Settings from the backend database
  // The UI fields accepts the setting values to show in their boxes.
  const setStatus = async () => {
    // var curStatus = await getBotStatus();
    // TODO For UI Test
    var curStatus = {
      mainBnbAmount : 100,
      mainTokenAmount : 200000,
      tokenInfo : {
        name: "DogeCoin",
        abbr: "DOGE"
      },
      mainWalletAddress : "0x4DD589F02844FB048715F7145a8FF70d8506F19e",
      botStatus: "buy",
      totalWalletCount: 3000,
      processedWalletCount: 1678
    }

    setMainBnbAmount (curStatus.mainBnbAmount);
    setMainTokenAmount (curStatus.mainTokenAmount);

    setTokenInfo(curStatus.tokenInfo);
    setMainWalletAddress(curStatus.mainWalletAddress);

    setRunningStatus (curStatus.botStatus);

    setTotalWalletCount(curStatus.totalWalletCount);
    setProcessedWalletCount(curStatus.processedWalletCount);
    
  };

  /**
   * On loading 
   * Get the status(parameters) of the app.
   * Get the list of the transactions 
   * to show to the UI.
   */
  useEffect(() => {
    setStatus();
  }, []);

  /**
   * Show UI frame. 
   * For entering the bot parameters.
   *     Viewing the list of the transactions. 
   */

  const now = Math.round(processedWalletCount / totalWalletCount * 100);

  return (
    <div>
      <h3>
        Main Wallet Status :  
      </h3>
        <b>{transKind}</b> {tokenInfo.name} {transKind==="buy"? "to" : "from" } Wallet {mainWalletAddress}
        <br/>
        <br/>
      <div className="row" id="main_status">
        <div className="form-group col-sm-12 col-md-5">
          <label htmlFor="bnbamount"> BNB amount: {mainBnbAmount} BNB</label>
        </div>
        <div className="form-group col-sm-12 col-md-7">
          <label htmlFor="bnbamount"> Token amount: {mainTokenAmount} {tokenInfo.abbr}</label>
        </div>
      </div>

      <div  className="row" id="trans_amount">
        <div className="form-group col-sm-12 col-md-8">
          <div>
            <label htmlFor="amount">Total Trading Amount in BNB</label>
            <input
              type="number"
              id="tradeBnb"
              className="short-input"
              value={tradeBnb}
              onChange={(e) => {
                setTradeBnb(e.target.value);
              }}
            />
          </div>
          <div>
            For each wallet in BNB : { tradeBnb/totalWalletCount }
          </div>
        </div>

        <div className="form-group col-sm-12 col-md-4">
          <Button
              variant={ runningStatus !== "stop" ? "danger" : "primary"}
              className="btn_start"
              onClick={ runningStatus !== "stop"? () => stop() : () => start()}
          >
            { runningStatus !== "stop" ? "Stop Bot" : "Start " + transKind}
          </Button>
        </div>
      </div>
      <div className="row" id="progress">
        <div className="form-group col-sm-12 col-md-12">
          <ProgressBar animated now={now} label={`${now}%`} />
          <div className="float-right">
            { processedWalletCount } / { totalWalletCount } wallets processed   
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bot;
