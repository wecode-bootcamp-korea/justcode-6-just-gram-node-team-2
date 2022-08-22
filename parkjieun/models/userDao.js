const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch(() => {
    console.log("Data Source initialize failed..");
  });

// signUp
const createUser = async (nickname, email, hashedPw, profile_image) => {
  const result = await myDataSource.query(
    `INSERT INTO users(nickname, email, password, profile_image) VALUES (?, ?, ?, ?)`,
    [nickname, email, hashedPw, profile_image]
  );

  return result;
};

// logIn
const logInUser = async (email) => {
  const result = myDataSource.query(
    `SELECT id, password FROM users u WHERE u.email = ?`,
    [email]
  );
  return result;
};

module.exports = {
  createUser,
  logInUser,
};
