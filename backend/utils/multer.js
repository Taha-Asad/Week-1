const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const fileFilter = function (req, file, cb) {
  const allowedType = "/jpeg|jpg|png|webp/";
  const extName = allowedType.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedType.test(file.mimetype);
  if (extName && mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Only image files are allowed!");
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2mb
});

module.exports = upload;
