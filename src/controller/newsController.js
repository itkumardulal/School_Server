const { authorizedDomain } = require("../config/config");
const { news } = require("../database/connection");
const uploadToR2 = require("../util/r2Upload");

const addNews = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const role = req.userRole;
  const user = req.user;

  if (role !== "admin") {
    return res.status(403).json({ message: "Only admins can create news" });
  }

  const schoolDomain = user.schoolDomain;

  let imgUrl = null;
  let imgName = null;

  if (req.file) {
    // For images
    if (req.uploadType === "image" && req.file.size > 1024 * 1024) {
      return res.status(400).json({ message: "Image must be under 1MB" });
    }

    const result = await uploadToR2(req.file);
    imgUrl = result.fileUrl;
    imgName = result.fileName;
  }

  await news.create({
    title,
    description,
    imgUrl,
    imgName,
    schoolDomain,
  });

  return res.status(201).json({
    message: "News added successfully",
  });
};

const fetchNews = async (req, res) => {
  const allowedDomains = authorizedDomain.allowedDomains;
  const origin = req.get("origin");

  if (!origin) {
    return res.status(400).json({ message: "Missing origin header" });
  }

 const domain = new URL(origin).hostname.toLowerCase().trim();


  if (!allowedDomains.includes(domain)) {
    return res.status(403).json({ message: 'Unauthorized domain' });
  }

  const data = await news.findAll({
    where: { schoolDomain: domain },
    order: [['createdAt', 'DESC']],
  });

  if (data.length === 0) {
    return res.status(404).json({ message: "News not found" });
  }

  return res.status(200).json({
    message: 'News fetched successfully',
    data,
  });
};




const fetchNewsByAdmin = async (req, res) => {
  const domain = req.user.schoolDomain;
  const data = await news.findAll({
    where: { schoolDomain: domain },
    order: [['createdAt', 'DESC']],
  });

   if (data.length === 0) {
    return res.status(404).json({ message: "News not found" });
  }
  
  return res.status(200).json({
    message:'News fetched successfully',
    data
  });
};


const fetchSingleNews = async (req, res) => {
  const { id } = req.params;
  const data = await news.findByPk(id);
  if (!data) {
    return res.status(404).json({ message: "News not found" });
  }
  res.status(200).json({
    message: "Single news fetched successfully",
    data,
  });
};

const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  const role = req.userRole;
  const user = req.user;

  if (role !== "admin") {
    return res.status(403).json({ message: "Only admins can update news." });
  }

  const domain = user.schoolDomain;

  const existingNews = await news.findOne({
    where: { id, schoolDomain: domain },
  });

  if (!existingNews) {
    return res
      .status(404)
      .json({ message: "News not found or access denied." });
  }

  let imgUrl = req.body.imgUrl || existingNews.imgUrl;
  let imgName = req.body.imgName || existingNews.imgName;

  if (req.file) {
    if (req.uploadType === "image" && req.file.size > 1024 * 1024) {
      return res.status(400).json({ message: "Image must be under 1MB" });
    }

    const result = await uploadToR2(req.file);
    imgUrl = result.fileUrl;
    imgName = result.fileName;
  }

  await news.update({ title, description, imgUrl, imgName }, { where: { id } });

  return res.status(200).json({ message: "News updated successfully" });
};

const deleteNews = async (req, res) => {
  const { id } = req.params;

  const file = await news.findByPk(id);
  if (!file) {
    return res.status(404).json({ message: "News not found" });
  }

  await news.destroy({ where: { id } });

  return res.status(200).json({
    message: "News deleted successfully",
  });
};

module.exports = {
  addNews,
  fetchNews,
  updateNews,
  deleteNews,
  fetchSingleNews,
  fetchNewsByAdmin
};
