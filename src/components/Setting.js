import React from "react";
import { Button } from "react-bootstrap";
import "./Label.css";
import {
  resetFrontAPI,
  initFrontAPI,
  resetAllAPI
} from "./api";

/**
 * UI module for handling Settings. 
 * Directly call Backend API for settings, - no more than this.
 * @returns 
 */
const Setting = () => {

  const resetFront = () => {
    resetFrontAPI();
  };

  const initFront = () => {
    initFrontAPI();
  };

  const resetAll = () => {
    resetAllAPI();
  };

  return (
    <div>
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12">
          <div className="form-group">
            <Button variant="danger" className="setting-btn" onClick={() => resetFront()}>
              Reset Setting
            </Button>
            <label htmlFor="usr" className="setting-label">
              {" "}
              &nbsp;&nbsp;Reset the Bot information such as wallet, key,
              node, gas, etc.
            </label>
          </div>
          <div className="form-group">
            <Button variant="danger" className="setting-btn" onClick={() => initFront()}>
              Clear History
            </Button>
            <label htmlFor="usr" className="setting-label">
              {" "}
              &nbsp;&nbsp;Clear the Bot transaction history.
            </label>
          </div>
          <div className="form-group">
            <Button variant="danger" className="setting-btn" onClick={() => resetAll()}>
              Init All
            </Button>
            <label htmlFor="usr" className="setting-label">
              {" "}
              &nbsp;&nbsp;Init All data
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
