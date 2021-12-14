import { API_URL, client } from "./api";


/**
 * call to List Transactions actions
 * See backend documentation - 
 * Simple API wrapper for calling the backend API.
 * Note : Transaction is the history that was made in the backend. 
 *        We can not add or delete the transaction from list.
 */

export async function listFront() {
  try {
    let res = await client.get(`${API_URL}/transactions/front`);
    let data = res.data.data;
    return data;
  } catch (err) {
    console.log(err);
  }
}


