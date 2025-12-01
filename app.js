const express = require("express");
const routes = require("./routes");
const cors = require("cors");
class App {
  constructor() {
    this.server = express();
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(express.urlencoded({extended: true}));
    this.server.use(routes);
  }
}

module.exports = new App().server;
