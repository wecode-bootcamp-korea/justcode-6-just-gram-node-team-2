const myDataSource = require("./DBinit");

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
