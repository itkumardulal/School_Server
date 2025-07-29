const {
  isLogin,
  verifyToken,
  logout,
 } = require("../controller/authController");
const {
  isAuthenticated,
  restrictedTo,
  Roles,
} = require("../middleware/isAuthenticated");
const catchError = require("../util/catchError");
const loginRateLimiter = require("../util/rateLimiter");

const router = require("express").Router();


router
  .route("/verify")
  .get(
    isAuthenticated,
    restrictedTo(Roles.superAdmin, Roles.admin),
    catchError(verifyToken)
  );

router.route("/login").post(loginRateLimiter, catchError(isLogin));

router.route("/logout").post(catchError(logout));

module.exports = router;
