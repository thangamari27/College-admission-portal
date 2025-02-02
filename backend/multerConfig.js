const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Directory for uploads
const UPLOADS_DIR = 'uploads';
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer Middleware
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValidType =
      allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
      allowedTypes.test(file.mimetype);
    if (isValidType) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png, gif) are allowed.'));
    }
  },
});

module.exports = upload;
