import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API ,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionally, you can add interceptors to handle requests or responses

export default axiosInstance;