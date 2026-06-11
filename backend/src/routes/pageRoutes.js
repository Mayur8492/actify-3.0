const express = require('express');
const { createPage, getPages, getPageById, updatePage, deletePage } = require('../controllers/pageController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.route('/')
  .post(createPage)
  .get(getPages);

router.route('/:id')
  .get(getPageById)
  .put(updatePage)
  .delete(deletePage);

module.exports = router;
