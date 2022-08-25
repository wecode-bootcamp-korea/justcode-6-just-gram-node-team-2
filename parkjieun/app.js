const express = require("express");
const cors = require("cors");
const router = require("./routers");

const createApp = () => {
  const app = express();

  app.use(cors(), express.json());
  app.use(router);

  return app;
};

module.exports = { createApp };
