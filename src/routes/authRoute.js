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
const { resetLoginAttempts, loginRateLimiter } = require("../util/rateLimiter");

const router = require("express").Router();

router
  .route("/verify")
  .get(
    isAuthenticated,
    restrictedTo(Roles.superAdmin, Roles.admin),
    catchError(verifyToken)
  );

router.post("/login", loginRateLimiter, async (req, res) => {
  const originalSend = res.send;
  let statusCode;

  // Wrap res.send to get status code
  res.send = function (body) {
    statusCode = res.statusCode;
    return originalSend.call(this, body);
  };

  await isLogin(req, res);

  if (res.headersSent) {
    if (statusCode < 400) {
      // Success: reset attempts for this email+IP
      resetLoginAttempts(req.rateLimitData.key);
    } else {
      // Failure: increment count for this email+IP
      req.rateLimitData.data.count++;
    }
  }
});

router.route("/logout").post(catchError(logout));

module.exports = router;
