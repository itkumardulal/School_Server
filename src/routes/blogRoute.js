const {
  addBlog,
  fetchBlogs,
  fetchBlogByAdmin,
  fetchSingleBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blogController");

const {
  isAuthenticated,
  Roles,
  restrictedTo,
} = require("../middleware/isAuthenticated");

const catchError = require("../util/catchError");

const router = require("express").Router();

// Public & Admin routes for blogs
router
  .route("/blogs")
  .get(catchError(fetchBlogs)) // Public fetch
  .post(
    isAuthenticated,
    restrictedTo(Roles.admin),
    catchError(addBlog) // Admin add
  );

// Admin fetch all blogs
router
  .route("/blogs/admin")
  .get(isAuthenticated, restrictedTo(Roles.admin), catchError(fetchBlogByAdmin));

// Single blog, update & delete
router
  .route("/blogs/:id")
  .get(catchError(fetchSingleBlog))
  .patch(
    isAuthenticated,
    restrictedTo(Roles.admin),
    catchError(updateBlog)
  )
  .delete(isAuthenticated, restrictedTo(Roles.admin), catchError(deleteBlog));

module.exports = router;
