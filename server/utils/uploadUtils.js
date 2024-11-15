import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the directory exists
const uploadDirectory = 'uploads/profilePictures';
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Save the files in the 'uploads/profilePictures' directory
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const filename = `${Date.now()}_${Math.round(Math.random() * 1E9)}${fileExtension}`; // Unique filename
    cb(null, filename); 
  },
});

// Accept only image files (jpeg, jpg, png)
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Proceed with the file upload
  } else {
    cb(new Error('Only image files (jpeg, jpg, png) are allowed!'), false); // Reject the file
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5MB
});

export default upload;
