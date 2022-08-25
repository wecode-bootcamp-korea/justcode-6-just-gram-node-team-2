const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  charset: process.env.TYPEORM_CHARSET,
});

myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!1");
  })
  .catch((err) => {
    console.log(err);
  });
// --------------------------------------------------------------
const createUser = async (nickname, email, hashedPassword, profile_image) => {
  const user = await myDataSource.query(
    `
    INSERT INTO users(nickname, email, password, profile_image)
    VALUES(? ,? ,?, ?);
  `,
    [nickname, email, hashedPassword, profile_image]
  );
  return user;
};
// --------------------------------------------------------------
const login = async (email, password) => {
  // PART 2 : database 조작
  // username을 이용하는 사용자가 DB에 있는지 확인
  const [user] = await myDataSource.query(
    `
    SELECT 
      id, 
      email, 
      password 
    FROM users 
    WHERE email = ?
  `,
    [email]
  );
  return user;
};
// --------------------------------------------------------------

module.exports = {
  createUser,
  login,
};
