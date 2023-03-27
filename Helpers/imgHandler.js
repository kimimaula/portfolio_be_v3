const multer = require("multer");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWSKEYID,
  secretAccessKey: process.env.AWSKEYSECRET,
});

const multerStorage = multer.memoryStorage();
const multerUploads = (fieldName) => {
  return multer({ storage: multerStorage }).single(fieldName);
};

const uploadImageToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }

    const { originalname, buffer } = file;
    const params = {
      Bucket: "portfolio-kimmi",
      Key: originalname.replace(/ /g, "_"),
      Body: buffer,
      ContentType: file.mimetype,
    };

    s3.upload(params, (error, data) => {
      if (error) {
        reject(error);
      } else {
        const publicUrl = data.Location;
        resolve(publicUrl);
      }
    });
  });
};

module.exports = {
  multerUploads,
  uploadImageToStorage,
};
