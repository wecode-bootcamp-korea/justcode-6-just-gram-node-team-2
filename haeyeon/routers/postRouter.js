const express = require('express')
const postController = require("../controllers/postController")

const router = express.Router();

router.post('', postController.createPost);
router.get('', postController.getPosting);
router.get('/user/1', postController.getPostingByUserId)
router.patch('', postController.updatePosting);
router.delete('', postController.deletePosting);

module.exports = router 