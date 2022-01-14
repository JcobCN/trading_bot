import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { Button, FormControl } from "react-bootstrap";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { usePromiseTracker } from "react-promise-tracker";
import { trackPromise } from 'react-promise-tracker';
import ReactHover, { Trigger, Hover } from "react-hover";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import { MDBDataTableV5 } from "mdbreact";


import Web3 from "web3";
import {
  getMainSetting, setMainSetting,
  addWorkWallet, listWorkWallets, deleteWorkWallet, addWorkWalletFromFile,
  getWorkWalletBalance,
  resetAllAPI,
} from "../api/settings";
import { createNotification, } from "../api"
import CONFIG from "../constant/config";

/**
 * UI module for handling Settings. 
 * Directly call Backend API for settings, - no more than this.
 * @returns 
 */


const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress && 
    <div style={
      {
        width: "100%",
        height: "100",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }
    }>
      <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
    </div>
  );
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

  const [tokenAddr, setTokenAddr] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [mainWalletAddr, setMainWalletAddr] = useState("");
  const [mainPrivateKey, setMainPrivateKey] = useState("");

  const load_MainSetting = async () => {
    let settings = await getMainSetting();
    settings = settings!== undefined ? settings[0] : undefined;

    if(settings !== undefined) {
      setTokenAddr(settings.tokenAddress);
      setTokenName(settings.tokenName);
      setTokenSymbol(settings.tokenSymbol);
      setMainWalletAddr(settings.mainWalletAddress);
      setMainPrivateKey(settings.mainWalletPrivateKey);
    }
  }

  /**
   * On loading 
   * Get the status(parameters) of the app.
   * Get the list of the transactions 
   * to show to the UI.
   */
  useEffect(() => {
    load_MainSetting();
  }, []);

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
                onClick={(e) => setMainSetting(
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

  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [workWallets, setWorkWallets] = useState([]);
  const [showBalance, setShowBalance] = useState(false);

  const fileRef = useRef();

  const upload_wallet_file = (uploadFiles) => {
    trackPromise(
      addWorkWalletFromFile(uploadFiles).then(result => console.log(result))
    );
    
    list_Wallets();
  }

  const load_file = () => {
    fileRef.current.click();
  }

  const list_Wallets = async () => {
    let items = await listWorkWallets();
    if(items !== undefined)
      setWorkWallets(items);
  };

  useEffect(() => {
    list_Wallets();
  }, []);

  const add_Wallet = async (_address, _privateKey) => {
    try {
      const workAddress = Web3.utils.toChecksumAddress(_address.trim());
      let newWallets = [
        ...workWallets,
        {
          walletAddress: workAddress,
          // walletBnb:0.0,
          // walletToken:0.0,
        },
      ];

      setWorkWallets(newWallets);

      addWorkWallet(address, _privateKey);

      // Clear the text for next input.
      setAddress("");   
      setPrivateKey("");
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const optionsCursorTrueWithMargin = {
    followCursor: true,
    shiftX: 20,
    shiftY: 0
  };

  const walletBalance = async (address) => {
    const balance = await getWorkWalletBalance(address);
    return " BNB balance : " + balance.bnbBalance + ", Token balance : " + balance.tokenBalance;
  }

  // console.log(wallets);
  var rows = useMemo(() => {
    return workWallets.map((item) => {
      const newItem = { ...item };
      newItem.addressHash = (
          <a
            href={CONFIG.EXPLORER_ADDR + item.walletAddress}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.walletAddress}
          </a>
      );
      newItem.balance = (
        <div>
          <Button
            variant="info"
            size="sm"
            onClick={() => walletBalance(item.walletAddress).then((data)=>window.alert(data)) }
          >
            Balance
          </Button>
        </div>
      );
      newItem.actions = (
        <div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => delete_Wallet(item.walletAddress)}
          >
            Balance
          </Button>
        </div>
      );
      return newItem;
    });
  }, [workWallets]);
  
  const data = {
    columns: [
      {
        label: "Address",
        field: "addressHash",
      },
      {
        label: "Balance",
        field: "balance",
      },
      // {
      //   label: "Token",
      //   field: "walletToken",
      // },
      {
        label: "Action",
        field: "actions",
      },
    ],
    rows: rows,
  };
  
  const delete_Wallet = (wallet) => {
    deleteWorkWallet(wallet);
    let newWallets = workWallets.filter( (obj)  => obj.addressHash !== wallet );
    setWorkWallets(newWallets);
  };

  return (      
    <div className="border border-primary px-2 py-2 my-2" >
      <div className="row" id="add_wallet">
        <div className="form-group col-sm-12 col-md-10">
          <h3>
            Trading Work Wallet List
          </h3>
        </div>

        <div className="form-group col-sm-12 col-md-2">
          <LoadingIndicator/>
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
              onChange={(e) => upload_wallet_file(e.target.files)}
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
  
  const resetAll = () => {
    resetAllAPI().then( (result) => {
      if(result.error ==="false")
        createNotification("succcess", "Successfully reseted the database.");
      else 
        createNotification("error", "Database reset error : " + result.message);
    })
  };

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

/*
const reducer = (state, action) => {
  switch (action.type) {
    case "set_tokenAddr":
      return {
        ... state,
        tokenAddr: action.tokenAddr,
      };
    case "set_tokenName":
      return {
        ... state,
        tokenName: action.tokenName,
      };
    case "set_tokenSymbol":
      return {
        ... state,
        tokenSymbol: action.tokenSymbol,
      };
    case "set_mainWalletAddr":
      return {
        ... state,
        mainWalletAddr: action.mainWalletAddr,
      };
    case "set_tokenName":
      return {
        ... state,
        mainPrivateKey: action.mainPrivateKey,
      };
    default:
      return state;
  }
};

const SettingContext = React.createContext();

const SettingProvider = ({ children }) => {
  const [settings, dispatch] = useReducer(reducer, {
    tokenAddr: "",
    tokenName: "",
    tokenSymbol: "",
    mainWalletAddr: "",
    mainPrivateKey: "",
    address: "",
    privateKey: "",
    workWallets: "",
  });

  return (
    <SettingContext.Provider value={{ settings, dispatch }}>
      {children}
    </SettingContext.Provider>
  );
};
*/

const Settings = () => {

  return (
    <div>      
      {/* <SettingContext.Provider value={{settings, dispatch}}> */}
        <Tabs defaultActiveKey="mainwallet" id="setting-tab" className="mb-3"
          onSelect={ (curIndex, lastIndex) => { 
            // if(curIndex === "mainwallet") {
            //   load_MainSetting();
            // } else if (curIndex === "workwallets") {
            //   WorkWallets.list_Wallets();
            // }
          }}
        >
          <Tab eventKey="mainwallet" title="Main Wallet">
            <MainWallet />
          </Tab>
          <Tab eventKey="workwallets" title="Work Wallet">
            <WorkWallets />
          </Tab>
          <Tab eventKey="reset" title="Reset">
            <ResetSettings />
          </Tab>
        </Tabs>
      {/* </SettingContext.Provider> */}
    </div>
  );
};

export default Settings;
