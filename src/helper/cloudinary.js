const cloudinary = require("cloudinary").v2;
const cloud_name = "dcjurkvr2";
const api_key = "519967689382894";
const api_secret = "R-fIZiXdZz2AbL0e56ohYd2DbiI";

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

module.exports = cloudinary;
