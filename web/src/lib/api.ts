import axios from "axios";

export const api = axios.create({
  baseURL: "https://api-peach-eight-20.vercel.app",
});
