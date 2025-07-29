const {
  fetchMessage,
  addMessage,
  deleteMessage,
} = require("../controller/messageController");
const {
  isAuthenticated,
  restrictedTo,
  Roles,
} = require("../middleware/isAuthenticated");
const catchError = require("../util/catchError");

const router = require("express").Router();

router
  .route("/message")
  .post(catchError(addMessage))
  .get(isAuthenticated, restrictedTo(Roles.admin), catchError(fetchMessage));

router
  .route("/message/:id")
  .delete(
    isAuthenticated,
    restrictedTo(Roles.admin),
    catchError(deleteMessage)
  );

module.exports = router;
