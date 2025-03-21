// import multer from 'multer';

// // Set up storage options for multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');  // Folder where you want to save images
//   },
//   filename: (req, file, cb) => {
//     const timestamp = Date.now();
//     cb(null, `${timestamp}-${file.originalname}`);  // Give a unique name to each file
//   }
// });

// // Filter allowed file types
// const fileFilter = (req, file, cb) => {
//   const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);  // Accept the file
//   } else {
//     cb(new Error('Invalid file type'), false);  // Reject if not an image
//   }
// };

// // Apply multer settings
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 1024 * 1024 * 5 }  // File size limit (5MB)
// });

// export default upload;

import multer from "multer";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
}); 

const upload = multer({
  storage
  });

export default upload;
