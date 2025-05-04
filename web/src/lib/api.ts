import axios from "axios";

export const api = axios.create({
  baseURL: "https://taxa-conversao-node-react.onrender.com",
});
