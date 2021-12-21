import React, { useState, useEffect, useRef } from "react";
import NumericInput from "react-numeric-input";

import Bot from '../components/Bot'

import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { startDistribteBot, startGatherBot } from "../api";

/**
 * Basic UI module for handling BNB distribute / gather operation
 * Detailed comments are seen below.
*/
const DistributeGather = () => {

  const [mainBnbAmount, setMainBnbAmount] = useState(0);
  const [mainTokenAmount, setMainTokenAmount] = useState(0);
  const [totalWalletCount, setTotalWalletCount] = useState(0);

  const [targetResource, setTargetResource] = useState("bnb");

  const [amount, setAmount] = useState(0);              // Amount for distribute 
  const [percentage, setPercentage] = useState("50");  // Percentage to gather from each wallet.
  
  const percentageRef = useRef();
  const amountRef = useRef();

  const MainWalletStatus = () => {
    return (
      <div>
        <h3>
          Main Wallet Status :
        </h3>

        <div className="row">
          <div className="form-group col-sm-12 col-md-4">
            Amount in BNB : {mainBnbAmount}
          </div>
          <div className="form-group col-sm-12 col-md-4">
            Amount in Token : {mainTokenAmount}
          </div>
        </div>

        <h3>
          Total wallets :
        </h3>

        <div className="row">
          <div className="form-group col-sm-12 col-md-8">
            Total work wallets registered : {totalWalletCount}
          </div>
        </div>        
      </div>
    );
  }

  function setTargetResourceByCheck(e) {
    if(e.target.checked) 
      setTargetResource("bnb");
    else 
      setTargetResource("token");
  }

  const TargetResource = () => {
    return (
      <span className="section_radio" id="targetResource">
        <label className="px-2">
          <input
            type="radio"
            value="bnb"
            checked={targetResource === "bnb"}
            onChange={(e) => {
              setTargetResourceByCheck(e);
            }}
          />
          &nbsp;BNB
        </label>
        <label className="px-2">
          <input
            type="radio"
            value="token"
            checked={targetResource === "token"}
            onChange={(e) => {
              setTargetResource("token");
            }}
          />
          &nbsp;Token
        </label>
      </span>
    );
  }

  const percentageFormat = (num) => num + ' %';
  const amountFormat = (num) => num + (targetResource === "bnb" ? " bnb" : " token");  

  function set100Percent(e) {
    if(e.target.checked) 
      setPercentage(100);
  }


  // Parameter : amount in Distribute
  // Parameter : percentage for Gather
  // TODO : {amount / totalWalletCount} {targetResource} for each wallet. is not working, due to onChange() issue.
  // TODO : Make a class for NumericInputWithMax that extends NumericInput
  const DistributeParameter = () => {
    return (
      <div >
        <div className="row">
          <h3> Distribute {targetResource.toUpperCase()} to each wallet </h3>
        </div>
        <div className="row  d-flex align-items-end h-100">
          <div className="form-group col-sm-12 col-md-5">
            <label htmlFor="address">Total Amount :</label>
            <NumericInput 
              className="form-control form-control-md"
              min={0} max={(targetResource === "bnb" ? mainBnbAmount : mainTokenAmount)}
              id="amount"
              value={amount}
              format={amountFormat}
              ref={amountRef}
            />
          </div>

          <div className="form-group col-sm-12 col-md-7">
            {amount / totalWalletCount} {targetResource} for each wallet.
          </div>
        </div>
      </div>
    );
  }

  const GatherParameter = () => {
    return (
      <div>
        <div className="row">
          <h3> Gather {targetResource.toUpperCase()} from each wallet </h3>
        </div>

        <div className="row">
          <div className="form-group col-sm-12 col-md-4">
            <NumericInput className="form-control"
              min={0} max={100} value={50}
              id="percentage"
              value={percentage}
              format={percentageFormat}
              ref={percentageRef}
            />
          </div>

          <div className="form-group col-sm-12 col-md-8">
            <label>
              <input
                type="checkbox"
                onChange = { (e) => set100Percent(e) }
              />
              &nbsp;Gather whole amount.
            </label>
          </div>
        </div>
      </div>
    );
  };

  const callDistributeBot = () => {
    startDistribteBot(amountRef.value);
  };

  const callGatherBot = () => {
    startGatherBot(percentageRef.value);
  };

  const DistributeHelp = () => {
    return (
    <div>
      <p>Pleaes enter the amount to distribute to each wallet.</p>
      <p> The amount you enter will be evenly distributed to each wallet.</p>
    </div>
    );
  }

  const GatherHelp = () => {
    return (
    <div>
      <p>Pleaes enter the percentage to gather from each wallet.</p>
      <p>Please note : </p>
        <p>Each wallet should have enough BNB (minimum amount) to cover gas fee. Or, the transaction will fail.</p>
        <p>The bot will save some amount of BNB for further transaction gas fee. </p>
        <p> So, you will get percentage lower than you expected.</p>
    </div>
    );
  }

  // Load Settings from the backend database
  // The UI fields accepts the setting values to show in their boxes.
  const setStatus = async () => {
    var curStatus = await getBotStatus();

    // TEST For UI Test
    // var curStatus = {
    //   mainBnbAmount: 100,
    //   mainTokenAmount: 200000,
    //   tokenInfo: {
    //     name: "DogeCoin",
    //     abbr: "DOGE"
    //   },
    //   mainWalletAddress: "0x4DD589F02844FB048715F7145a8FF70d8506F19e",
    //   botStatus: "buy",
    //   totalWalletCount: 3000,
    // }

    // setMainBnbAmount(curStatus.mainBnbAmount);
    // setMainTokenAmount(curStatus.mainTokenAmount);

    // setTotalWalletCount(curStatus.totalWalletCount);
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


  return (
    <div>
      <Tabs defaultActiveKey="distributeBot" className="mb-3"
        onSelect={(curIndex, lastIndex) => {          
          if (curIndex === "distributeBot") {

          } else if (curIndex === "gatherBot") {

          }
        }}
      >
        <Tab eventKey="distributeBot" title="Distribute">
          <MainWalletStatus />
          <br/>
          <DistributeParameter />
          <TargetResource />
          <br/>
          <Bot transKind="distribute" callBot={callDistributeBot}/>
        </Tab>
        <Tab eventKey="gatherBot" title="Gather">
          <MainWalletStatus />
          <br/>
          <GatherParameter />
          <br/>
          <TargetResource />
          <br/>
          <Bot transKind="gather" callBot={callGatherBot} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default DistributeGather;