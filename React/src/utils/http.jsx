import axios from "axios";

class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: "http://localhost:3001",
      timeout: 10000,
    });
  }
}

const http = new Http().instance;
export default http;
