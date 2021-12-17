import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import DatePicker from 'react-date-picker';
import { MDBDataTable } from "mdbreact";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import CONFIG from "../constant/config";
import { listTransactions, clearHistory } from "../api/transaction";


const Transactions = () => {

  const [transactions, setTransactions] = useState([]);
  const [searchDate, setSearchDate] = useState(null);
  const [transKind, setTransKind] = useState("");

  var items = [];

  const list_transactions = async () => {
    items = await listTransactions(transKind,  searchDate);
    setTransactions(items);
  };

  const clear_history = async () => {
    clearHistory(); 
  };

  // Each row of the transaction.
  var rows = transactions.map((item) => {

    item.transactionHash = (
      <a 
        href={CONFIG.EXPLORER + item.transaction} 
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.transaction}
      </a>
    );

    item.addressHash = (
      <a 
        href={CONFIG.EXPLORER_ADDR + item.transaction} 
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.address}
      </a>
    );

    return item;
  });

  useEffect(() => {
    // TODO UI TEST CODE
    let items = [
      { 
        timestamp : "2021.12.16 18:00:00",         
        address : "0x4DD589F02844FB048715F7145a8FF70d8506F19e", 
        transaction : "0x4DD589F02844FB048715F7145a8FF70d8506F19e", 
        amount : 0.120,
        action : "Buy"
      },
      { 
        timestamp : "2021.12.17 20:00:00", 
        address: "0x5Ba73512651aBCD37ae219A23c33d39A43a291dF", 
        transaction : "0x4DD589F02844FB048715F7145a8FF70d8506F19e", 
        amount : 0.3570,
        action : "Sell"
      },
    ];
    setTransactions (items);
    return;
    
    list_transactions();    
  }, []);

  const data = {
    columns: [
      {
        label: "TimeStamp",
        field: "timestamp",
      },
      {
        label: "Wallet",
        field: "addressHash",
      },
      {
        label: "Transaction",
        field: "transactionHash",
      },
      {
        label: "Amount",
        field: "amount",
      },
      {
        label: "Buy/Sell",
        field: "action",
      },
    ],
    rows: rows,
  };

  return (
    <div>
      <div className="row" id="add_wallet">
        <div className="form-group col-sm-12 col-md-10">
          <h3>
            Transaction History : 
          </h3>
        </div>

        <div className="form-group col-sm-12 col-md-2">
          <div className="d-flex align-items-end">
            <Button
              variant="danger"
              size="md"
              onClick={() => clear_history()}>
              Clear
            </Button>
          </div>
        </div>
      </div>  

      <div className="row  d-flex align-items-center" id="list_filter">
        <div className="col-sm-12 col-md-2">
          <b>Filter Option : </b>
        </div>  
        <div className="col-sm-12 col-md-4" id="date_selector">
          <label htmlFor="searchdate">Search Date:</label>
          <DatePicker
            onChange={(date) => setSearchDate(date)}
            value={searchDate}
            id="searchdate"
          />
        </div>
        <div className="col-sm-12 col-md-6" id="buy_sell">
          <label htmlFor="transkind">Transaction Kind:</label>
          <span className="section_radio" id="transkind">
            <label className="px-2">
              <input
                type="radio"
                value="buy"
                checked={transKind === "buy"}
                onChange={(e) => {
                  setTransKind("buy");
                }}
              />
              &nbsp;Buy
            </label>
            <label className="px-2">
              <input
                type="radio"
                value="sell"
                checked={transKind === "sell"}
                onChange={(e) => {
                  setTransKind("sell");
                }}
              />
              &nbsp;Sell
            </label>
            <label className="px-2">
              <input
                type="radio"
                value="all"
                checked={transKind === ""}
                onChange={(e) => {
                  setTransKind("");
                }}
              />
              &nbsp;All
            </label>
          </span>
        </div>
      </div>

      <div>
          <MDBDataTable hover data={data} />
      </div>
    </div>
  );
};
export default Transactions;