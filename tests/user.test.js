const request = require("supertest");

const { createApp } = require("../app");
const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

describe("User sing up & login", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await myDataSource.initialize();
  });

  afterAll(async () => {
    await myDataSource.query(`TRUNCATE users`);

    await myDataSource.destroy();
  });

  test("SUCCESS: Created user", async () => {
    await request(app)
      .post("/users/signup")
      .send({
        data: {
          nickname: "sucheol",
          email: "wecode@gmail.com",
          password: "wecode123123",
        },
      })
      .expect(201)
      .expect({ message: "userCreated" });
  });

  test("FAILURE: Invalid username", async () => {
    await request(app)
      .post("/users/signup")
      .send({
        data: {
          email: "wecode@gmail.com",
          password: "wecode123123",
        },
      })
      .expect(400)
      .expect({ message: "Input Error" });
  });

  test("SUCCESS: login", async () => {
    await request(app)
      .post("/users/login")
      .send({
        data: {
          email: "wecode@gmail.com",
          password: "wecode123123",
        },
      })
      .expect(200)
      .expect({ message: "LOGIN_SUCCESS", token: token });
  });

  test("FAILURE: login", async () => {
    await request(app)
      .post("/users/login")
      .send({
        data: {
          email: "wecode@gmail.com",
          password: "justcode123123",
        },
      })
      .expect(404)
      .expect({ message: "INVALID_PASSWORD" });
  });
});
