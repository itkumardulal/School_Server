const { authorizedDomain } = require("../config/config");
const { blogs } = require("../database/connection");

// Add a new blog (admin only)
const addBlog = async (req, res) => {
  const { title, content, category, author, featured } = req.body;

  if (!title || !content || !category || !author) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const role = req.userRole;
  const user = req.user;

  if (role !== "admin") {
    return res.status(403).json({ message: "Only admins can create blogs" });
  }

  const schoolDomain = user.schoolDomain;

  await blogs.create({
    title,
    content,
    category,
    author,
    featured: featured || false,
    schoolDomain,
  });

  return res.status(201).json({
    message: "Blog added successfully",
  });
};

// Fetch blogs (public, domain-restricted)
const fetchBlogs = async (req, res) => {
  const allowedDomains = authorizedDomain.allowedDomains;
  const origin = req.get("origin");

  if (!origin) {
    return res.status(400).json({ message: "Missing origin header" });
  }

  const domain = new URL(origin).hostname
    .toLowerCase()
    .replace(/^www\./, "")
    .trim();

  if (!allowedDomains.includes(domain)) {
    return res.status(403).json({ message: "Unauthorized domain" });
  }

  const data = await blogs.findAll({
    where: { schoolDomain: domain },
    order: [["createdAt", "DESC"]],
  });

  if (data.length === 0) {
    return res.status(200).json({ message: "No blogs found",data:[] });
  }

  return res.status(200).json({
    message: "Blogs fetched successfully",
    data,
  });
};



// Fetch blogs for admin (admin only)
const fetchBlogByAdmin = async (req, res) => {
  const domain = req.user.schoolDomain;
  const data = await blogs.findAll({
    where: { schoolDomain: domain },
    order: [["createdAt", "DESC"]],
  });

  if (data.length === 0) {
    return res.status(200).json({ message: "No blogs found" ,data:[]});
  }

  return res.status(200).json({
    message: "Blogs fetched successfully",
    data,
  });
};

// Fetch single blog
const fetchSingleBlog = async (req, res) => {
  const { id } = req.params;
  const data = await blogs.findByPk(id);

  if (!data) {
    return res.status(200).json({ message: "Blog not found",
      data:null
     });
  }

  return res.status(200).json({
    message: "Single blog fetched successfully",
    data,
  });
};

// Update blog (admin only)
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, author, featured } = req.body;

  if (!title || !content || !category || !author) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const role = req.userRole;
  const user = req.user;

  if (role !== "admin") {
    return res.status(403).json({ message: "Only admins can update blogs." });
  }

  const domain = user.schoolDomain;

  const existingBlog = await blogs.findOne({
    where: { id, schoolDomain: domain },
  });

  if (!existingBlog) {
    return res
      .status(404)
      .json({ message: "Blog not found or access denied." });
  }

  await blogs.update(
    { title, content, category, author, featured: featured || false },
    { where: { id } }
  );

  return res.status(200).json({ message: "Blog updated successfully" });
};

// Delete blog (admin only)
const deleteBlog = async (req, res) => {
  const { id } = req.params;

  const existingBlog = await blogs.findByPk(id);
  if (!existingBlog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  await blogs.destroy({ where: { id } });

  return res.status(200).json({
    message: "Blog deleted successfully",
  });
};

module.exports = {
  addBlog,
  fetchBlogs,
  fetchBlogByAdmin,
  fetchSingleBlog,
  updateBlog,
  deleteBlog,
};
