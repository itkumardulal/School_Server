const {
  addNotice,
  fetchSingleNotice,
  updateNotice,
  deleteNotice,
  fetchNotice,
  fetchNoticesByAdmin,
} = require("../controller/noticeController");
const {
  isAuthenticated,
  restrictedTo,
  Roles,
} = require("../middleware/isAuthenticated");
const { pdfUpload } = require("../middleware/multerConfig");
const catchError = require("../util/catchError");

const router = require("express").Router();


router
  .route("/notices")
  .get(catchError(fetchNotice))
  .post(
    isAuthenticated,
    restrictedTo(Roles.admin),
    pdfUpload,
    catchError(addNotice)
  );
router.route('/notices/admin').get(isAuthenticated,restrictedTo(Roles.admin),catchError(fetchNoticesByAdmin));
router
  .route("/notices/:id")
  .get(catchError(fetchSingleNotice))
  .patch(
    isAuthenticated,
    restrictedTo(Roles.admin),
    pdfUpload,
    catchError(updateNotice)
  )
  .delete(isAuthenticated, restrictedTo(Roles.admin), catchError(deleteNotice));

module.exports = router;
