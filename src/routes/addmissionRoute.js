const { addAdmission, fetchAdmission, deleteAdmission } = require("../controller/admissionController");
const {
  isAuthenticated,
  restrictedTo,
  Roles,
} = require("../middleware/isAuthenticated");
const catchError = require("../util/catchError");

const router = require("express").Router();

router
  .route("/admission")
  .post(catchError(addAdmission))
  .get(isAuthenticated, restrictedTo(Roles.admin), catchError(fetchAdmission));

  router.route('/admission/:id').delete(isAuthenticated,restrictedTo(Roles.admin),catchError(deleteAdmission))

  module.exports = router