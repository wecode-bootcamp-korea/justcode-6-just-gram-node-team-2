const { DataSource } = require('typeorm')

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE
})

myDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  }).catch(() => {
    console.log("Database initiate fail")
  })

const createPost = async (user_id, contents) => {
  return await myDataSource.query(`
  INSERT INTO postings (user_id, contents)
  VALUES(?,?)
  `, [user_id, contents]);
}

const getPosting = async () => {
  const postingData = await myDataSource.query(`
  SELECT
  users.id as userId,
  users.profile_image as userProfileImage,
  postings.id as postingId,
  posting_images.image_url as postingImageUrl,
  postings.contents as postingContent
  FROM justgram_node.postings
  JOIN justgram_node.users ON users.id = postings.user_id
  JOIN justgram_node.posting_images ON postings.id = posting_images.posting_id;
  `)
  return postingData;
}

const getPostingByUserId = async () => {
  const postingData = await myDataSource.query(`
    SELECT
  users.id as userId,
  users.profile_image as userProfileImage,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'postingId', postings.id,
      'postingImageUrl', posting_images.image_url,
      'postingContent', postings.contents
    )
  ) as postings
  FROM justgram_node.postings
  JOIN justgram_node.users ON users.id = postings.user_id
  JOIN justgram_node.posting_images ON postings.id = posting_images.posting_id
  GROUP BY users.id
  ;`)
  return postingData;
}

const updatePosting = async (newContents, posting_id, user_id) => {
  await myDataSource.query(`
  UPDATE postings
  SET contents = ?
  WHERE id=? AND user_id=?;
  `, [newContents, posting_id, user_id]);

  const postingData = await myDataSource.query(`
  SELECT
  users.id as userId,
  users.profile_image as userProfileImage,
  postings.id as postingId,
  posting_images.image_url as postingImageUrl,
  postings.contents as postingContent
  FROM justgram_node.postings
  JOIN justgram_node.users ON users.id = postings.user_id
  JOIN justgram_node.posting_images ON postings.id = posting_images.posting_id;
  `)
  return postingData;
}

const deletePosting = async (req, res) => {
  await myDataSource.query(`
    DELETE FROM comments WHERE comments.posting_id =1;
  `)
  await myDataSource.query(`
    DELETE FROM postings WHERE postings.id =1;
  `)
  return
}

module.exports = { createPost, getPosting, getPostingByUserId, updatePosting, deletePosting }