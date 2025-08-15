const { registerUser, fetchUser, deleteUser } = require('../controller/userController');
const { isAuthenticated, restrictedTo, Roles } = require('../middleware/isAuthenticated');
const catchError = require('../util/catchError');

const router = require('express').Router()


router
  .route("/register")
  .post(
    isAuthenticated,
    restrictedTo(Roles.superAdmin),
    catchError(registerUser)
  );

router
  .route("/school")
  .get(
    isAuthenticated,
    restrictedTo(Roles.superAdmin),
    catchError(fetchUser)
  );

  router.route('/school/:id').delete(isAuthenticated,restrictedTo(Roles.superAdmin),catchError(deleteUser))

  module.exports=router
