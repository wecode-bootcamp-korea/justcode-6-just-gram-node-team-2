const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const cors = require("cors");
const express = require("express");

const router = require("./routers");
const { query } = require("express");

const app = express();
app.use(cors(), express.json());
app.use(router);

const server = http.createServer(app);

server.listen(8000, () => {
  console.log("server is listening on PORT 8000");
});
