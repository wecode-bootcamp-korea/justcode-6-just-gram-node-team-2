const dotenv = require("dotenv");
dotenv.config();

const createApp = require("./app");

const startServer = async () => {
  const app = createApp();

  app.listen(8000, () => {
    console.log("Server is listening on PORT 8000");
  });
};

startServer();
