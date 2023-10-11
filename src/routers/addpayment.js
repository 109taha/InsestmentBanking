const router = require("express").Router();
const AddPayment = require("../model/addPayment");
const { verifyUser } = require("../helper/middleware/verify");
const upload = require("../helper/multer");
const cloudinary = require("../helper/cloudinary");

router.post(
  "/addpayment",
  upload.array("attachArtwork", 1),
  verifyUser,
  async (req, res) => {
    const files = req.files;
    const attachArtwork = [];

    try {
      if (files && files.length > 0) {
        for (const file of files) {
          const { path } = file;
          try {
            const uploader = await cloudinary.uploader.upload(path, {
              folder: "investment",
            });
            attachArtwork.push({ url: uploader.secure_url });
            fs.unlinkSync(path);
          } catch (err) {
            if (attachArtwork.length > 0) {
              const imgs = attachArtwork.map((obj) => obj.public_id);
              cloudinary.api.delete_resources(imgs);
            }
            console.log(err);
          }
        }
      }
      console.log(attachArtwork);
      const userId = req.user;
      const newAddPayment = new AddPayment({
        userId,
        attachProved: attachArtwork[0].url,
      });
      await newAddPayment.save();
      return res.status(200).send({ success: true, data: newAddPayment });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error: " + error.message);
    }
  }
);

module.exports = router;
