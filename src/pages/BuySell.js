import React, { useState, useEffect, useRef } from "react";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import NumericInput from "react-numeric-input";

import Bot from '../components/Bot'

import 'react-confirm-alert/src/react-confirm-alert.css';

import { startTradingBot } from "../api";

/**
 * Basic UI module for handling Sell / Buy Bot Operation.
 * Detailed comments are seen below.
*/
const BuySell = () => {
  // Socket to check progress of the Bot.
  // const client = new W3CWebSocket("ws://localhost:8080/connect");

  var transactionItems = [];

  const PercentageContext = React.createContext(50);

  const [percentage, setPercentage] = useState(50);

  const percentageRef = useRef();

  // Parameter : percentage for buy or sell
  function callSellBot () {    
    startTradingBot("sell", percentageRef.value);
  }

  function callBuyBot (){    
    startTradingBot("buy", percentageRef.value);
  }

  const TradeParam = (props) => {
    const transKind = props.transKind;

    const percentageFormat = (num) => num + ' %';
    function set100Percent(e) {
      if(e.target.checked) setPercentage(100);
    }

    return (
      <div>
        <h3>
          {/* MODEL Sentence : 
            *   Sell BNB for token in each work wallet.
          */}
          {transKind === "sell" ? "Sell" : "Buy"} &nbsp;
          {transKind === "sell" ? "BNB" : "Token"} 
          &nbsp;for &nbsp;
          {transKind === "sell" ? "Token" : "BNB"}
        </h3>
        <div>
          <p>Pleaes enter the amount to swap in each wallet.</p>
          <p>CAUTION : </p>
          <ul>
            <li>Each wallet should have enough BNB (minimum amount) to cover gas fee. Or, the transaction will fail.</li>
            <li>During transaction, we will try to keep minimum amount of bnb for gas fee in the later transaction.
              So, the swapped bnb could be smaller than expected.
            </li>
          </ul>

        </div>
        <div className="row">
          <label htmlFor="amount" className="form-group col-sm-12 col-md-4"> 
            Trading for each Wallet
          </label>
          <div className="form-group col-sm-12 col-md-4">
            <NumericInput className="form-control"
              min={0} 
              max={80}
              id="percentage"
              value={percentage}
              format={percentageFormat}
              ref={percentageRef}
              // onChange={ (value) => setPercentage(value) }
            />
          </div>

          <div className="form-group col-sm-12 col-md-4">
            <label>
              <input
                type="checkbox"
                onChange = { (e) => set100Percent(e) }
              />
              Trade whole amount.
            </label>
          </div>

        </div>
      </div>
    );
  }
  

  return (
    <div>

      <Tabs defaultActiveKey="buyBot" className="mb-3"
        onSelect={(curIndex, lastIndex) => {
          if (curIndex === "buyBot") {
            
          } else if (curIndex === "sellBot") {

          }
        }}
      >

        <Tab eventKey="buyBot" title="Buy">
          <br/>
          <TradeParam transKind="buy" />
          <br/>
          <Bot transKind="buy" callBot={callBuyBot}/>
        </Tab>
        <Tab eventKey="sellBot" title="Sell">
          <br/>
          <TradeParam transKind="sell" />
          <br/>
          <Bot transKind="sell" callBot={callSellBot}/>
        </Tab>
      </Tabs>
    </div>
  );
};

export default BuySell;
