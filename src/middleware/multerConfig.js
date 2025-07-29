const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "..", "uploads")); // Create /uploads directory if not exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});


const fileFilter = (req, file, cb) => {
  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];


  if (allowedImageTypes.includes(file.mimetype)) {
    req.uploadType = "image";
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type. Only images  are allowed."), false);
  }
};


const singleUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 1MB
  },
}).single("file");


module.exports = {
  singleUpload,
 
};
