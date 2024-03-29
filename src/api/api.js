import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

/**
 * UI module for calling backend APIs.
 * call backend websocket APIs. 
 */
export const API_URL = "http://localhost:9080";
export const client = axios.create({
  baseURL: API_URL,
  headers: { 
      // "Content-Type": "application/x-www-form-urlencoded",
      "Content-type": "application/json"
  }
});

export const createNotification = (type, message) => {
  toast.configure({
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
  switch (type) {
    case "success":
      toast.success(message);
      return;
    case "warn":
      toast.warn(message);
      return;
    case "error":
      toast.error(message);
      return;
    case "info":
      toast.info(message);
      return;
    default:
      toast(message);
  }
};

export function errorMessage(err) {
  if (!err.response) return err.message;
  if (err.response.data) {
    return err.response.data;
  }
  return err.message;
}
