import React, { useState, useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import DatePicker from 'react-date-picker';
import { MDBDataTable } from "mdbreact";
import CONFIG from "../constant/config";
import { listTransactions, clearHistory } from "../api/transaction";


const Transactions = () => {

  const [transactions, setTransactions] = useState([]);
  const [searchDate, setSearchDate] = useState(null);

  var items = [];

  const list_transactions = async () => {
    items = await listTransactions(searchDate);
    console.log("Transactions = " + items);

    if(items !== undefined )
      setTransactions(items);
  };

  const clear_history = async () => {
    clearHistory(); 
  };

  // Each row of the transaction.
  const rows = useMemo(() => {
    return transactions.map((item) => {
      const newItem = { ...item };
      
      newItem.timestamp = (  
        new Date(item.timestamp).toUTCString()
      );

      newItem.transactionHash = (  
        <a 
          href={CONFIG.EXPLORER + item.transaction} 
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.transaction}
        </a>
      );

      newItem.fromHash = (
        <a 
          href={CONFIG.EXPLORER_ADDR + item.from} 
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.from}
        </a>
      );

      newItem.toHash = (
        <a 
          href={CONFIG.EXPLORER_ADDR + item.to} 
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.to}
        </a>
      );

      return newItem;
    });
  }, [transactions]);

  useEffect(() => {
    list_transactions();    
  }, []);

  const data = {
    columns: [
      {
        label: "TimeStamp",
        field: "timestamp",
      },
      {
        label: "Amount",
        field: "amount",
      },
      {
        label: "From",
        field: "fromHash",
      },
      {
        label: "To",
        field: "toHash",
      },
      {
        label: "Transaction",
        field: "transactionHash",
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
      </div>

      <div>
          <MDBDataTable hover data={data} />
      </div>
    </div>
  );
};
export default Transactions;