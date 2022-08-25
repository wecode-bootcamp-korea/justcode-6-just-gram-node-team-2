const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const http = require('http')
const router = require('./routers/index')
const port = 8000;

const app = express()
app.use(express.json())
app.use(router)

const server = http.createServer(app)

app.listen(port, () => {
  console.log(`example app listening on port ${port}`)
});