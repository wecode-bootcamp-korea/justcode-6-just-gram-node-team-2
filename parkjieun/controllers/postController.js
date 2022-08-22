const postService = require("../services/postService");

// posting
const createPost = async (req, res) => {
  const { userID, contents, postImg_url } = req.body;

  // 유효성 검사 - contents : null 가능 / postImg_url : not null
  if (!postImg_url) {
    res.status(400).json({ message: "사진을 첨부해 주세요." });
    return;
  }

  try {
    const result = await postService.createPost(userID, contents, postImg_url);
    res.status(201).json({ message: "postCreated" });
  } catch {
    // console.log(err);
    res.status(500).json({ message: "create post error" });
  }
};

// get post-list
const getPost = async (req, res) => {
  try {
    const result = await postService.getPost();
    res.status(200).json({ data: result });
  } catch {
    // console.log(err);
    res.status(500).json({ message: "get list error" });
  }
};

// get postList By userId
const getPostById = async (req, res) => {
  const { id } = req.body; // jwt랑 연결되게 해보자..
  const result = await postService.getPostById(id);

  res.status(200).json({ data: result });
};

// post update
const updatePost = async (req, res) => {
  const { id, newContents } = req.body; // id = posts.id

  if (!id) {
    res.status(400).json({ message: "없는 post 입니다." });
  }

  if (!newContents) {
    res.status(400).json({ message: "변경사항이 없습니다." });
  }

  try {
    const updatedPostData = await postService.updatePost(id, newContents);
    res.status(200).json({ message: updatedPostData });
  } catch {
    // status code 다시 알아보기
    res.status(500).json({ message: "update 실패했습니다." });
  }
};

// delete post
const deletePost = async (req, res) => {
  const { id } = req.body; //id =  posts.id

  if (!id) {
    // 단순히 body에 id의 입력이 있냐의 문제일 뿐 실제 post에 존재하는 id인지에 대한
    // 검증이 전혀 안된 상태.
    res.status(400).json({ message: "존재하지 않는 post입니다." });
  }

  try {
    const result = await postService.deletePost(id);
    res.status(200).json({ message: "postingDeleted" });
  } catch {
    console.log(err);
    res.status(500).json({ message: "post delete error" });
  }
};

module.exports = {
  createPost,
  getPost,
  getPostById,
  updatePost,
  deletePost,
};
