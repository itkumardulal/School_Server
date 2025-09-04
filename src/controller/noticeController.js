const { authorizedDomain } = require("../config/config");
const { notices } = require("../database/connection");
const uploadToR2 = require("../util/r2Upload");

const addNotice = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Please provide the title" });
  }

  const role = req.userRole;
  const user = req.user;

  if (role !== "admin") {
    return res.status(403).json({ message: "Only admins can create notices" });
  }

  const schoolDomain = user.schoolDomain;

  let pdfUrl = null;
  let pdfName = null;

  if (req.file) {
    // For PDFs
    if (req.uploadType === "pdf" && req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ message: "PDF must be under 10MB" });
    }

    const result = await uploadToR2(req.file);
    pdfUrl = result.fileUrl;
    pdfName = result.fileName;
  }

try {
  await notices.create({
    title,
    pdfUrl,
    pdfName,
    schoolDomain,
  });

  return res.status(201).json({ message: "Notice added successfully" });

} catch (error) {
  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ message: "A notice with this title already exists." });
  }

  return res.status(500).json({ message: "Server error while adding notice." });
}
}

const fetchNotice = async (req, res) => {
  const allowedDomains = authorizedDomain.allowedDomains;

  const origin = req.get("origin");
  if (!origin) {
    return res.status(400).json({ message: "Missing origin header" });
  }

const domain = new URL(origin).hostname.toLowerCase().replace(/^www\./, '').trim();



  if (!allowedDomains.includes(domain)) {
    return res.status(403).json({ message: 'Unauthorized domain' });
  }

  const data = await notices.findAll({
    where: { schoolDomain: domain },
    order: [['createdAt', 'DESC']],
  });

  if (data.length === 0) {
    return res.status(200).json({ message: "Notices not found",data:[] });
  }

  return res.status(200).json({
    message: 'Notices fetched successfully',
    data,
  });
};


const fetchNoticesByAdmin = async (req, res) => {
  const domain = req.user.schoolDomain;
  const data = await notices.findAll({
    where: { schoolDomain: domain },
    order: [['createdAt', 'DESC']],
  });

   if (data.length === 0) {
    return res.status(200).json({ message: "Notices not found",data:[] });
  }
  
  return res.status(200).json({
    message:'Notices fetched successfully',
    data
  });
};

const fetchSingleNotice = async (req, res) => {
  const { id } = req.params;
  const data = await notices.findByPk(id);
  if (!data) {
    return res.status(200).json({ message: "Notice not found",data:null });
  }
  return res.status(200).json({
    message: "Single notice fetched successfully",
    data,
  });
};

const updateNotice = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Please provide the title" });
  }

  const role = req.userRole;
  const user = req.user;

  if (role !== "admin") {
    return res.status(403).json({ message: "Only admins can update notices." });
  }

  const domain = user.schoolDomain;

  const existingNotice = await notices.findOne({
    where: { id, schoolDomain: domain },
  });

  if (!existingNotice) {
    return res
      .status(404)
      .json({ message: "Notice not found or access denied." });
  }

  let pdfUrl = req.body.pdfUrl || existingNotice.pdfUrl;
  let pdfName = req.body.pdfName || existingNotice.pdfName;

  if (req.file) {
    if (req.uploadType === "pdf" && req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ message: "PDF must be under 10MB" });
    }

    const result = await uploadToR2(req.file);
    pdfUrl = result.fileUrl;
    pdfName = result.fileName;
  }

  await notices.update({ title, pdfUrl, pdfName }, { where: { id } });

  return res.status(200).json({ message: "Notice updated successfully" });
};

const deleteNotice = async (req, res) => {
  const { id } = req.params;

  const notice = await notices.findByPk(id);
  if (!notice) {
    return res.status(404).json({ message: "Notice not found" });
  }

  await notices.destroy({ where: { id } });

  return res.status(200).json({ message: "Notice deleted successfully" });
};

module.exports = {
  addNotice,
  fetchNotice,
  fetchSingleNotice,
  updateNotice,
  deleteNotice,
  fetchNoticesByAdmin
};
