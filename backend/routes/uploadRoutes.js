import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// 1. Storage Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Save to 'uploads' folder in root
  },
  filename(req, file, cb) {
    // Name file: fieldname-date.extension (e.g., image-123456789.jpg)
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// 2. File Filter (Only Images)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

// 3. Initialize Multer
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// 4. The Route
// We upload ONE file named 'image'
router.post('/', upload.single('image'), (req, res) => {
  // Return the path so the frontend can save it in the Product DB
  res.send({
    message: 'Image Uploaded',
    image: `/${req.file.path.replace(/\\/g, '/')}`, // Fix Windows slashes
  });
});

export default router;