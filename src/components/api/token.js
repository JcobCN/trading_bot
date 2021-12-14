import { API_URL, client } from "./api";
/**
* Call token List actions - Including for all and black tokens.
* See backend documentation - 
* Simple API wrapper for calling the backend API.
*/
export async function listTokens() {
    try {
      let res = await client.get(`${API_URL}/tokens/list`);
      console.log(res)
      let data = res.data.data;
      return data;
    } catch (err) {
      console.log(err);
    }
}

export async function addToken(address) {
  try {
    await client.post(`${API_URL}/tokens/add`, {
      address : address
    });
  } catch (err) {
    console.log(err);
  }
}

export async function deleteToken(address) {
  try {
    await client.post(`${API_URL}/tokens/del`, {
      address : address
    });
  } catch (err) {
    console.log(err);
  }
}


export async function listBlackTokens() {
  try {
    let res = await client.get(`${API_URL}/tokens/blacklist`);
    console.log(res)
    let data = res.data.data;
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function addBlackToken(name, symbol, address) {
try {
  await client.post(`${API_URL}/tokens/blackadd`, {
    name: name,
    symbol: symbol,
    address : address
  });
} catch (err) {
  console.log(err);
}
}

export async function deleteBlackToken(address) {
try {
  await client.post(`${API_URL}/tokens/blackdel`, {
    address : address
  });
} catch (err) {
  console.log(err);
}
}





