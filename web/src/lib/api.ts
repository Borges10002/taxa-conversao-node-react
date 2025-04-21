import axios from "axios";

export const api = axios.create({
  baseURL: "https://api-lemon-theta-96.vercel.app",
});
