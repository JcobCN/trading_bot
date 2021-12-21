import React, { useState, useEffect } from "react";

import ProgressBar from 'react-bootstrap/ProgressBar'

import { confirmAlert } from "react-confirm-alert";
import { Button } from "react-bootstrap";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { stopBot, getBotStatus } from "../api";

import 'react-confirm-alert/src/react-confirm-alert.css';

/**
 * Basic UI module for handling Sell / Buy Bot Operation.
 * Detailed comments are seen below.
*/
const Bot = (props) => {

  const transKind = props.transKind;
  const startBot = props.callBot;

  // Socket to check progress of the Bot.
  // const client = new W3CWebSocket("ws://localhost:8080/connect");

  const [totalWalletCount, setTotalWalletCount] = useState(0);
  const [processedWalletCount, setProcessedWalletCount] = useState(0);
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

  /**
   * Show UI frame. 
   * For entering the bot parameters.
   *     Viewing the list of the transactions. 
   */

  const progress = totalWalletCount === 0 ? 0 :  Math.round(processedWalletCount / totalWalletCount * 100);

  // Run the backend bot by pressing "Start Bot" toggle button.
  const start = () => {
    if (runningStatus !== "stop") {
      if (confirmStopBot(runningStatus
        + " Bot is running. \n Will you stop it and start "
        + transKind + "Bot?"))
        stopBot();
      else {
        // TODO Should move page for current Bot Activity
        return;
      }
    }
    startBot();
  };

  // Stop the Bot as pressing "Stop Bot" toggle button  
  const stop = () => {
    stopBot();
  };

  return (
    <div>
      <br />
      <h3>Bot Operation for {transKind.toUpperCase()}</h3>
      <br />

      <div className="row" id="trans_amount">
        <div className="form-group col-sm-12 col-md-4">
          <Button
            variant={runningStatus !== "stop" ? "danger" : "primary"}
            className="btn_start"
            onClick={runningStatus !== "stop" ? () => stop() : () => start()}
          >
            {runningStatus !== "stop" ? "Stop Bot" : "Start " + transKind}
          </Button>
        </div>
      </div>
      <div className="row" id="progress">
        <div className="form-group col-sm-12 col-md-12">
          <ProgressBar animated now={progress} label={`${progress}%`} />
          <div className="float-right">
            {processedWalletCount} / {totalWalletCount} wallets processed
          </div>
        </div>
      </div>
    </div>
  );

};

export default Bot;
