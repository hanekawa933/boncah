import axios from "axios";

const instance = axios.create({
  // baseURL: process.env.NODE_ENV === 'development' ? `http://localhost:8000/api/v1` : "https://boncahfarm.com/api/v1",
  baseURL: "https://boncahfarm.online/api/v1",
});

export default instance;
