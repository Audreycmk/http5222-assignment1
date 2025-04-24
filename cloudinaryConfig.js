const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: "dtxmgotbr",
  api_key: "611997419319178",
  api_secret: "Gr02Jbtx3euZ9249YwdA6pNfaIA"
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm']
  }
});

module.exports = { storage };