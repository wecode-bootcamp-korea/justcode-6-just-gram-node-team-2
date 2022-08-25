const router = require("./routers");
const express = require("express");

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(router);

  return app;
};

module.exports = { createApp };
