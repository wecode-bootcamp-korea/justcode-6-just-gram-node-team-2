const request = require("supertest");

const { createApp } = require("../app");
const myDataSource = require("../models/DBinit");

// 어떤 test를 하는지 설명
describe("Sign Up", () => {
  let app;

  // test 실행되기 전
  beforeAll(async () => {
    app = createApp();
    await myDataSource.initialize();
  });

  // test 끝나고 나서
  afterAll(async () => {
    await myDataSource.query(
      `DELETE FROM users WHERE email = "unitTEST3@gmail.com"`
    ); //  test한 table 삭제
    await myDataSource.destroy(); // test DB와 연결 끊기
  });

  // test 시작
  /*
  test("FAILED: invalid email", async () => {
    // FAILED test의 의미 : 의도한대로 오류 발생?
    // 어떤 test를 할 것인지
    await request(app) // app에 test용 request를 보냄(supertest의 request 활용)
      .post("/usrs/signup") // HTTP Method, end point
      .send({ email: "wrongEmail", password: "12345" }) // req.body
      .expect(400) // 예상하는 res statusCode
      .expect({ message: "invalid email!" });
  });
  */

  test("SUCCESS: created user", async () => {
    await request(app)
      .post("/users/signup")
      .send({
        nickname: "UnitTest3",
        email: "unitTEST3@gmail.com",
        password: "12345",
        profile_image: "http://profile_image_23.jpeg",
      })
      .expect(201);
  });

  /* 에러 핸들링 안했다... 
  test("FAILED: duplicated email", async () => {
    await request(app)
      .post("/users/signup")
      .send({
        nickname: "UnitTest1",
        email: "unitTEST1@gmail.com",
        password: "12345",
        profile_image: "http://profile_image_23.jpeg",
      })
      .expect(409)
      .expect({ message: "duplicated email!" });
  });
  */
});

describe("Sign In", () => {
  let app;

  // test 실행되기 전
  beforeAll(async () => {
    app = createApp();
    await myDataSource.initialize();
  });

  // test 끝나고 나서
  afterAll(async () => {
    // await myDataSource.query(``); //  TRUNCATE users test한 table 삭제
    await myDataSource.destroy(); // test DB와 연결 끊기
  });

  test("SUCCESS: user sign in", async () => {
    await request(app)
      .post("/users/signin")
      .send({ email: "unitTEST1@gmail.com", password: "12345" })
      .expect(200);
  });
});

describe("Create Posting", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await myDataSource.initialize();
  });

  afterAll(async () => {
    await myDataSource.query(`DELETE FROM posts ORDER BY id DESC LIMIT 3 `); // test한 table 삭제
    await myDataSource.destroy(); // test DB와 연결 끊기
  });

  test("SUCCESS: created posting", async () => {
    await request(app)
      .post("/posts/posting")
      .send({ userID: 1, contents: "유닛 테스트 4", postImg_url: "IMAGE4" })
      .expect(201);
  });
});

describe("Get all postings list", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await myDataSource.initialize();
  });

  afterAll(async () => {
    // await myDataSource.query(``); // test한 table 삭제
    await myDataSource.destroy(); // test DB와 연결 끊기
  });

  test("SUCCESS: get all postings list", async () => {
    await request(app).get("/posts/list").expect(200);
  });
});

describe("Get all postings list by user", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await myDataSource.initialize();
  });

  afterAll(async () => {
    // await myDataSource.query(``); // test한 table 삭제
    await myDataSource.destroy(); // test DB와 연결 끊기
  });

  test("SUCCESS: get all postings list by user", async () => {
    await request(app)
      .get("/posts/listById")
      .send({
        id: 1,
      })
      .expect(200);
  });
});

describe("Update a posting", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await myDataSource.initialize();
  });

  afterAll(async () => {
    // await myDataSource.query(``);
    await myDataSource.destroy(); // test DB와 연결 끊기
  });

  test("Update a posting with new contents", async () => {
    await request(app)
      .patch("/posts/update")
      .send({ id: 2, newContents: "유닛 테스트 수정 연습!!" })
      .expect(200);
  });
});

describe("Delete a posting", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await myDataSource.initialize();
  });

  afterAll(async () => {
    await myDataSource.query(`
      INSERT INTO posts (user_Id, contents, postImg_url) VALUES (1, "delete 테스트", "IMAGE5")`);
    await myDataSource.destroy(); // test DB와 연결 끊기
  });

  test("Delete a posting by posting Id", async () => {
    await request(app)
      .delete("/posts/delete")
      .send({
        id: 2,
      })
      .expect(200);
  });
});
