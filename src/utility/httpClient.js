import axios from "axios";
import { USER_AGENT } from "../config/default.js";

export const http = axios.create({
  timeout: 20000,
  headers: {
    "User-Agent": USER_AGENT,
  },
});

export async function get(url, config = {}) {
  try {
    const res = await http.get(url, config);
    return res.data;
  } catch (err) {
    console.error(" HTTP GET FAILED:", url, err.message);
    throw err;
  }
}
