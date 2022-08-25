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
    console.log("Data Source has been initialized!2");
  })
  .catch((err) => {
    console.log(err);
  });
// --------------------------------------------------------------
const createPosting = async (user_id, contents, image_url) => {
  // userId가 db에 있는지 확인. 없으면 error
  const isUserIdCorrect = (
    await myDataSource.query(
      `select EXISTS (select id from users where id=?) as success;`,
      [user_id]
    )
  )[0].success;

  if (isUserIdCorrect == 0) {
    const postsUserIdError = new Error("user_id is not correct!");
    postsUserIdError.status = 404;
    throw postsUserIdError;
  }

  await myDataSource.query(
    `
    INSERT INTO postings(user_id, contents)
    VALUES(?, ?);
    `,
    [user_id, contents]
  );
  const id = await myDataSource.query(
    `SELECT id FROM postings WHERE user_id = ? AND contents = ?`,
    [user_id, contents]
  );
  //id의 형태: [RowDataPacket { id: 10 } ]
  const posting_id = id[0].id;
  //image가 여러 개 일 수 있으므로 for문
  for (let i = 0; i < image_url.length; i++) {
    await myDataSource.query(
      `
    INSERT INTO posting_images(posting_id, image_url)
    VALUES(?, ?);
    `,
      [posting_id, image_url[i]]
    );
  }
};
// ------------------------------------------------------------
const searchPostings = async () => {
  const everyPost = await myDataSource.query(`
  SELECT
    users.id AS userId,
    users.profile_image AS userProfileImage,
    postings.id AS postingId,
    JSON_ARRAYAGG(posting_images.image_url) AS postingImageUrl,
    postings.contents AS postingContent
  FROM postings
  JOIN users ON users.id = postings.user_id
  JOIN posting_images ON posting_images.posting_id = postings.id
  GROUP BY postings.id;
  `);

  return everyPost;
};
// ------------------------------------------------------------
const modifyPosting = async (userId, postingId, content) => {
  // userId가 db에 있는지 확인. 없으면 error
  const isUserIdCorrect = (
    await myDataSource.query(
      `SELECT EXISTS (SELECT id FROM users WHERE id= ?) AS success;`,
      [userId]
    )
  )[0].success;
  if (isUserIdCorrect == 0) {
    const userIdError = new Error("userId in not correct!");
    userIdError.status = 404;
    throw userIdError;
  }

  // userId와 postingId가 맞는지 확인. 다르면 error
  let postingList = [];
  const postingIdRowDataPacket = await myDataSource.query(
    `SELECT id FROM postings WHERE user_id = ?;`,
    [userId]
  );
  postingIdRowDataPacket.forEach((item) => {
    postingList.push(item.id);
  });
  const isPostingIdCorrect = postingList.includes(postingId);
  if (!isPostingIdCorrect) {
    const postingIdError = new Error("postingId in not correct!");
    postingIdError.status = 404;
    throw postingIdError;
  }

  await myDataSource.query(
    `UPDATE postings SET contents = ? WHERE id = ? AND user_id = ?`,
    [content, postingId, userId]
  );

  const newPosting = await myDataSource.query(
    `
    SELECT
      users.id AS userId,
      nickname AS userName,
      postings.id AS postingId,
      contents AS postingContent
    FROM postings
    JOIN users ON postings.user_id = users.id
    WHERE postings.id = ?`,
    [postingId]
  );

  return newPosting;
};
// ------------------------------------------------------------
const deletePosting = async (userId, postingId) => {
  // userId가 db에 있는지 확인. 없으면 error
  const isUserIdCorrect = (
    await myDataSource.query(
      `select EXISTS (select id from users where id=?) as success;`,
      [userId]
    )
  )[0].success;
  if (isUserIdCorrect == 0) {
    throw new Error("userId is not correct!");
  }
  let postingList = [];

  // userId와 postingId가 맞는지 확인. 다르면 error
  const postingIdRowDataPacket = await myDataSource.query(
    `SELECT id FROM postings WHERE user_id = ?;`,
    [userId]
  );
  postingIdRowDataPacket.forEach((item) => {
    postingList.push(item.id);
  });
  const isPostingIdCorrect = postingList.includes(postingId);
  if (!isPostingIdCorrect) {
    throw new Error("posting_id is not correct!");
  }

  await myDataSource.query(
    `
    DELETE FROM comments WHERE posting_id = ?`,
    [postingId]
  );
  await myDataSource.query(
    `
    DELETE FROM posting_images WHERE posting_id = ?`,
    [postingId]
  );
  await myDataSource.query(
    `
    DELETE FROM postings WHERE id = ?`,
    [postingId]
  );
};
// ------------------------------------------------------------
const searchPostingsByUser = async (userId) => {
  // userId가 db에 있는지 확인. 없으면 error
  const isUserIdCorrect = (
    await myDataSource.query(
      `select EXISTS (select id from users where id=?) as success;`,
      [userId]
    )
  )[0].success;
  if (isUserIdCorrect == 0) {
    throw new Error("userId is not correct!");
  }

  const postingsByUser = await myDataSource.query(
    `
    SELECT
      users.id AS userId,
      users.profile_image AS userProfileImage,
      posting.posts AS postings
      FROM users
      LEFT JOIN postings ON postings.user_id = users.id
      LEFT JOIN (
        SELECT 
          postings.id AS postingId,
          JSON_ARRAYAGG(
          JSON_OBJECT(
            'postingId', postings.id,
            'postingContent', postings.contents
              )) AS posts
          FROM postings
            LEFT JOIN users ON postings.user_id = users.id
            GROUP BY postings.user_id = 1
        ) posting ON posting.postingId = postings.id
        
      WHERE users.id = 1;
    `
  );

  /*
  const postingsByUser = await myDataSource.query(
    `
    SELECT
      users.id AS userId,
      users.profile_image AS userProfileImage,
      P.postingData AS postings
    FROM users
    JOIN postings ON users.id = postings.user_id
    LEFT JOIN (
      SELECT
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'postingId', postings.id,
            'postingImageUrl', Pi.image,
            'postingContent', postings.contents
          )
        ) AS postingData
        FROM postings
        LEFT JOIN (
          SELECT
            posting_images.image_url AS image
          FROM posting_images
          LEFT JOIN postings ON postings.user_id = users.id
          LEFT JOIN users ON users.id = postings.user_id
        ) Pi ON posting_images.posting_id = postings.id
      GROUP BY postings.id
      ) P ON postings.id = P.postingId
    WHERE users.id = ?
    `,
    [userId]
  );
  */
  /*
  // 데이터 가져오기
  const postingsByUser = await myDataSource.query(
    `
    SELECT
      users.id AS userId,
      profile_image AS userProfileImage,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'postingId', postings.id,
          'postingContent', postings.contents,
          'postingImageUrl', ?
        )
      ) AS postings
    FROM postings
    JOIN users ON postings.user_id = users.id
    JOIN posting_images ON posting_images.posting_id = postings.id
    WHERE users.id = ?
    `,
    [userId]
  );
*/
  return postingsByUser;
};
// ----------------------------------------------------------------
module.exports = {
  createPosting,
  searchPostings,
  modifyPosting,
  deletePosting,
  searchPostingsByUser,
};
