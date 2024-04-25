const path = require("path");
const multer = require("multer");
const {v4:uuidv4} = require("uuid");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file);
        cb(null, "./public/images/uploads");
    },
    filename: function (req, file, cb) {
            let fn = uuidv4();
        cb(null, fn+path.extname(file.originalname));
    },
    
});
//file filter 
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.png', '.jpg','jpeg','.svg','gif','webp',''];

  // Check if the file extension is in the allowed list
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (allowedFileTypes.includes(fileExtension)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type'), false); // Reject the file
  }
};

// Set up Multer limits
const limits = {
  fileSize: 2 * 1024 * 1024, // 2 MB limit
};
  


const upload = multer({
    storage,
    fileFilter,
    limits
});

module.exports = upload;