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

describe("JUSTGRAM-API test", () => {
  let app;

  // test 실행되기 전
  beforeAll(async () => {
    app = createApp();
    await myDataSource.initialize();
  });

  // test 끝나고 나서
  afterAll(async () => {
    await myDataSource.query(`TRUNCATE posts;`); // test한 table의 row 삭제
    await myDataSource.query(`set foreign_key_checks = 0;`);
    await myDataSource.query(`TRUNCATE users;`);
    await myDataSource.query(`set foreign_key_checks = 1;`);

    await myDataSource.destroy(); // test DB와 연결 끊기
  });

  //users test 시작
  describe("Users API test", () => {
    describe("User Sign Up", () => {
      test("SUCCESS: created user", async () => {
        await request(app)
          .post("/users/signup")
          .send({
            nickname: "UnitTest1",
            email: "unitTEST1@gmail.com",
            password: "12345",
            profile_image: "http://profile_image_1.jpeg",
          })
          .expect(201);
      });
    });

    describe("Sign In", () => {
      test("SUCCESS: user sign in", async () => {
        await request(app)
          .post("/users/signin")
          .send({ email: "unitTEST1@gmail.com", password: "12345" })
          .expect(200);
      });
    });
  });

  //posts test 시작
  describe("Posts API test", () => {
    describe("Create posting", () => {
      test("SUCCESS: created posting", async () => {
        await request(app)
          .post("/posts/posting")
          .send({ userID: 1, contents: "테스트 1", postImg_url: "IMAGE 1" })
          .expect(201);
      });
    });

    describe("Get all postings list", () => {
      test("SUCCESS: get all postings list", async () => {
        await request(app).get("/posts/list").expect(200);
      });
    });

    describe("Get postings list by userID", () => {
      test("SUCCESS: get postings list by userID", async () => {
        await request(app)
          .get("/posts/listById")
          .send({
            id: 1,
          })
          .expect(200);
      });
    });

    describe("Update a posting contents by posting ID", () => {
      test("SUCCESS: Update posting with new contents", async () => {
        await request(app)
          .patch("/posts/update")
          .send({
            id: 1,
            newContents: "유닛 테스트 1",
          })
          .expect(200);
      });
    });

    describe("Delete a posting by postingID", () => {
      test("SUCCESS: Delete a posting by postingID", async () => {
        await request(app).delete("/posts/delete").send({ id: 1 }).expect(200);
      });
    });
  });
});
