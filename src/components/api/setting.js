import { API_URL, client } from "./api";

/**
 * Call Settings actions 
 * See backend documentation - 
 * Simple API wrapper for calling the backend API.
 */

export async function resetFrontAPI() {
  try {
     await client.post(`${API_URL}/setting/resetFront`);
  } catch (err) {
    console.log(err);
  }
}


export async function initFrontAPI() {
  try {
     await client.post(`${API_URL}/setting/initFront`);
  } catch (err) {
    console.log(err);
  }
}


export async function resetAllAPI() {
  try {
    await client.post(`${API_URL}/setting/resetAll`);;
  } catch (err) {
    console.log(err);
  }
}



