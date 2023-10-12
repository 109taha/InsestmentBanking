const router = require("express").Router();
const AddPayment = require("../model/addPayment");
const { verifyUser, verifyAdmin } = require("../helper/middleware/verify");
const upload = require("../helper/multer");
const cloudinary = require("../helper/cloudinary");
const fs = require("fs");

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

router.get("/all", verifyAdmin, async (req, res) => {
  try {
    const all = await AddPayment.find();
    if (all.length <= 0) {
      return res.status(400).send({
        success: false,
        message: "no payment verification is found",
      });
    }
    res.status(200).send({ success: true, data: all });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error: " + error.message);
  }
});
router.get("/one/:Id", verifyAdmin, async (req, res) => {
  try {
    const allId = req.params.Id;
    const all = await AddPayment.findById(allId);
    if (!all) {
      return res.status(400).send({
        success: false,
        message: "no payment verification is found",
      });
    }
    res.status(200).send({ success: true, data: all });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error: " + error.message);
  }
});

module.exports = router;
