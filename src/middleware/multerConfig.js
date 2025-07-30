const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the uploads folder path
const uploadPath = path.join(__dirname, "..", "..", "uploads");

// Ensure uploads folder exists, create if missing
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // Use the ensured folder path
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedImageTypes.includes(file.mimetype)) {
    req.uploadType = "image";
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type. Only images are allowed."), false);
  }
};

const singleUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, 
  },
}).single("file");

module.exports = {
  singleUpload,
};
