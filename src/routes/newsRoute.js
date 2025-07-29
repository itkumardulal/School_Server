const {
  deleteNews,
  updateNews,
  fetchSingleNews,
  addNews,
  fetchNews,
} = require("../controller/newsController");
const {
  isAuthenticated,
  Roles,
  restrictedTo,
} = require("../middleware/isAuthenticated");
const { singleUpload } = require("../middleware/multerConfig");
const catchError = require("../util/catchError");

const router = require("express").Router();
router
  .route("/news")
  .get(catchError(fetchNews))
  .post(
    isAuthenticated,
    restrictedTo(Roles.admin),
    singleUpload,
    catchError(addNews)
  );
router
  .route("/news/:id")
  .get(catchError(fetchSingleNews))
  .patch(
    isAuthenticated,
    restrictedTo(Roles.admin),
    singleUpload,
    catchError(updateNews)
  )
  .delete(isAuthenticated, restrictedTo(Roles.admin), catchError(deleteNews));

module.exports = router;
