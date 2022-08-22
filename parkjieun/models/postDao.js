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

// posting
const createPost = async (userID, contents, postImg_url) => {
  const result = await myDataSource.query(
    `INSERT INTO posts (user_id, contents, postImg_url) VALUES (?, ?, ?)`,
    [userID, contents, postImg_url]
  );

  return result;
};

// get post-list
const getPost = async () => {
  const result = await myDataSource.query(
    `SELECT p.user_id as userId, u.profile_image as userProfileImage, 
    p.id as postingId, p.postImg_url as postingImageUrl,
    p.contents as postingContent
    FROM posts p INNER JOIN users u ON p.user_id = u.id`
  );

  return result;
};

// get postList By UserId
const getPostById = async (id) => {
  const result = await myDataSource.query(
    `
  SELECT
    u.id as userId,
    u.profile_image as userProfileImage,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'postingId', p.id,
        'postingImageUrl', p.postImg_url,
        'postingContents', p.contents
      )
    ) as postings
  FROM posts p
  JOIN users u ON u.id = p.user_id
  WHERE u.id = ?
  GROUP BY u.id
  `,
    [id]
  );

  return result;
};

// update post
const updatePost = async (id, newContents) => {
  // 첫번째 쿼리문 - update post
  await myDataSource.query(
    `
  UPDATE posts
  SET contents = ?
  WHERE id = ?;
`,
    [newContents, id]
  );
  // 만약 두 쿼리문을 분리한다면.. const getPostById = (id) => {}
  // 두번째 쿼리문 - updated post 가져오기
  const updatedPostData = await myDataSource.query(
    `
  SELECT
    p.user_id as userId,
    u.nickname as userName,
    p.id as postingId,
    p.postImg_url as postingImage,
    p.contents as postingContent
  FROM posts p
  JOIN users u ON u.id = p.user_id
  WHERE p.id = ?
`,
    [id]
  );
  return updatedPostData;
};

// delete post
const deletePost = async (id) => {
  return await myDataSource.query(`DELETE FROM posts WHERE id = ?`, [id]);
};

module.exports = {
  createPost,
  getPost,
  getPostById,
  updatePost,
  deletePost,
};
