import { API_URL, client } from "./api";


/**
 * @function listTransactions
 * @description 
 * <pre>
 * call to List Transactions actions
 * See backend documentation - 
 * Simple API wrapper for calling the backend API.
 * Note : Transaction is the history that was made in the backend. 
 *        We can not add or delete the transaction from list.
 * </pre>
 * @param transKind - "buy", "sell" /  that indicates the kind of the transaction 
 */

export async function listTransactions(
  date
) {
  try {
    let res = await client.post(`${API_URL}/transactions/listTransactions`, {
      date : date
    });
    let data = res.data.data;
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function clearHistory () {
  try {
    let res = await client.get(`${API_URL}/transactions/clearHistory`);
    let data = res.data.data;
    return data;
  } catch (err) {
    console.log(err);
  }
}

