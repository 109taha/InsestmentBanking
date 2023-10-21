const router = require("express").Router();
const AddPayment = require("../model/addPayment");
const Wallet = require("../model/wallet");
const User = require("../model/userSchema");
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

router.post("/createWallet", verifyAdmin, async (req, res) => {
  try {
    const { amount, userId } = req.body;
    const user = await User.findById(userId);
    const existingWallet = user.wallet;
    if (existingWallet != null) {
      const walletId = user.wallet.toString();
      const wallet = await Wallet.findById(walletId);
      wallet.amount += amount;
      await wallet.save();
      return res.status(200).send({ success: true, data: wallet });
    }
    const newWallet = new Wallet({
      amount,
      userId,
    });
    await newWallet.save();
    user.wallet = newWallet._id;
    await user.save();
    res.status(200).send({ success: true, data: newWallet });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error!");
  }
});

router.get("/allWallet", verifyAdmin, async (req, res) => {
  try {
    const all = await Wallet.find();
    if (all.length <= 0) {
      return res.status(400).send({
        success: false,
        message: "No wallet found",
      });
    }
    res.status(200).send({ success: true, data: all });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error: " + error.message);
  }
});

router.post("/removeAmount/:walletId", verifyAdmin, async (req, res) => {
  try {
    const walletId = req.params.walletId;
    const amount = req.body.amount;
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res
        .status(400)
        .send({ success: false, message: "No wallet found!" });
    }
    if (wallet.amount < amount) {
      return res.status(400).send({
        success: false,
        message: "User didn't have that blance in his wallet",
      });
    }
    wallet.amount -= amount;
    await wallet.save();
    res.status(200).send({ success: true, data: wallet });
  } catch (error) {
    console.error(error);
    req.status(500).send("Internal server error!");
  }
});

module.exports = router;
