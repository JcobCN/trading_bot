import React, { useEffect, useState } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar'
import { w3cwebsocket } from "websocket";

import { confirmAlert } from "react-confirm-alert";
import { Button } from "react-bootstrap";
// import io from "socket.io-client";
import { stopBot } from "../api";

import 'react-confirm-alert/src/react-confirm-alert.css';

const thisSessionId = Math.random().toString(36).substr(2, 9);

/**
 * Basic UI module for handling Sell / Buy Bot Operation.
 * Detailed comments are seen below.
*/
const Bot = (props) => {

  const client = new w3cwebsocket("ws://localhost:9080/connect");

  const transKind = props.transKind;
  const startBot = props.callBot;

  const [totalWorkWalletCount, setTotalWorkWalletCount] = useState(0);
  const [processedWorkWalletCount, setProcessedWorkWalletCount] = useState(0);
  const [runningStatus, setRunningStatus] = useState("stop");

  // Socket to check progress of the Bot.

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

  const progress = totalWorkWalletCount === 0 
            ? 0 :  Math.round(processedWorkWalletCount / totalWorkWalletCount * 100);

  // Run the backend bot by pressing "Start Bot" toggle button.
  const start = () => {
    if (runningStatus !== "stop") {
      if (confirmStopBot(runningStatus
        + " Bot is running. \n Will you stop it and start "
        + transKind + "Bot?")) {
        stopBot();
        } else {
        // TODO Should move page for current Bot Activity
        return;
      }
    }
    setRunningStatus(props.transKind);

    const rtVal = startBot();
    if(rtVal == false)
      setRunningStatus("stop");    
  };
  
  // Stop the Bot as pressing "Stop Bot" toggle button  
  const stop = () => {
    stopBot();
  };

  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      var msg = JSON.parse(message.data);
      if(msg.message === "progress") {
        setTotalWorkWalletCount( msg.data.totalWorkWalletCount );
        setProcessedWorkWalletCount ( msg.data.processedWorkWalletCount );
      }
      if(totalWorkWalletCount == processedWorkWalletCount ) 
        setRunningStatus("stop");
    };    
  }, []);

  const buttonCaption = () => {
    switch (runningStatus) {
      case "pause": return ("Resume " + transKind);
      case "stop": return ("Start " + transKind);
      default : return ("Stop");
    }
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
            { buttonCaption (runningStatus) }
          </Button>
        </div>
      </div>
      <div className="row" id="progress">
        <div className="form-group col-sm-12 col-md-12">
          <ProgressBar animated now={progress} label={`${progress}%`} />
          <div className="float-right">
            {processedWorkWalletCount} / {totalWorkWalletCount} wallets processed
          </div>
        </div>
      </div>
    </div>
  );

};

export default Bot;
