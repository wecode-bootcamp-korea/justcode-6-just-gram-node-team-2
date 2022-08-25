const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

router.post("/posting", postController.createPost);
router.get("/list", postController.getPost);
router.patch("/update", postController.updatePost);
router.delete("/delete", postController.deletePost);
router.get("/listById", postController.getPostById);

module.exports = router;
