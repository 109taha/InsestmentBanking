const router = require("express").Router();
const Investment = require("../model/investmentSchema");
const { verifyAdmin, verifyUser } = require("../helper/middleware/verify");
const ContactUs = require("../model/ContactUs");
const User = require("../model/userSchema");
const Wallet = require("../model/wallet");

router.post("/create", verifyAdmin, async (req, res) => {
  try {
    const { detail, planDuration, price, contactUs, adminAcc } = req.body;
    if ((!detail, !price, !planDuration, contactUs, !adminAcc)) {
      return res
        .status(400)
        .send({ success: false, message: "You have to provide all the feild" });
    }
    const newInvestment = await new Investment({
      detail,
      planDuration,
      price,
      contactUs,
      adminAcc,
    });
    await newInvestment.save();
    res.status(200).send({ success: true, data: newInvestment });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
    throw error;
  }
});

router.put("/update/:Id", verifyAdmin, async (req, res) => {
  try {
    const invId = req.params.Id;
    const { detail, planDuration, price, contactUs, adminAcc } = req.body;
    const inv = await Investment.findById(invId);

    inv.detail = detail || inv.detail;
    inv.planDuration = planDuration || inv.planDuration;
    inv.price = price || inv.price;
    inv.adminAcc = adminAcc || inv.adminAcc;
    inv.contactUs = contactUs || inv.contactUs;

    await inv.save();

    res.status(200).send({ success: true, data: inv });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
    throw error;
  }
});

router.post("/buyInvestment/:invetId", verifyUser, async (req, res) => {
  try {
    const userId = req.user;
    const invetId = req.params.invetId;
    const investment = await Investment.findById(invetId);
    if (!investment) {
      return res
        .status(400)
        .send({ success: false, message: "No investment is " });
    }

    const user = await User.findById(userId);
    const wallet = await Wallet.findById(user.wallet.toString());
    if (investment.price > wallet.amount) {
      return res.status(400).send({
        success: false,
        message: "You don't have enough balance to buy that investment plan",
      });
    }
    wallet.amount -= investment.price;
    await wallet.save();

    investment.userId.push(userId);
    await investment.save();
    res
      .status(200)
      .send({ success: true, message: "You successFully get the investment" });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

router.get("/all", async (req, res) => {
  try {
    const allInv = await Investment.find();
    if (!allInv.length > 0) {
      return res
        .status(400)
        .send({ success: false, message: "No Investment Found " });
    }
    res.status(200).send({ success: true, data: allInv });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
    throw error;
  }
});

router.get("/one/:Id", async (req, res) => {
  try {
    const invId = req.params.Id;
    const allInv = await Investment.findById(invId)
      .populate("contactUs")
      .populate("adminAcc");
    if (allInv.lenght <= 0) {
      return res
        .status(400)
        .send({ success: false, message: "No Investment Found " });
    }
    res.status(200).send({ success: true, data: allInv });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
    throw error;
  }
});

router.delete("/one/:Id", verifyAdmin, async (req, res) => {
  try {
    const invId = req.params.Id;
    const allInv = await Investment.findByIdAndDelete(invId);
    if (allInv.lenght <= 0) {
      return res
        .status(400)
        .send({ success: false, message: "No Investment Found " });
    }
    res
      .status(200)
      .send({ success: true, message: "Investment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
    throw error;
  }
});

router.post("/contact", verifyAdmin, async (req, res) => {
  try {
    const { phoneNumber, email } = req.body;
    if (!phoneNumber) {
      return res
        .status(400)
        .send({ success: false, message: "You have to provide number atlest" });
    }
    const existingContact = await ContactUs.findOne({ phoneNumber });
    if (existingContact) {
      return res.status(400).send({
        success: false,
        message: "This number has been already in used",
      });
    }
    const newContact = new ContactUs({
      phoneNumber,
      email,
    });
    await newContact.save();
    res.status(200).send({ success: true, data: newContact });
  } catch (error) {
    console.error(error);
    re.status(500).send("Internal server error");
    throw error;
  }
});

router.put("/contact/update/:Id", verifyAdmin, async (req, res) => {
  try {
    const conId = req.params.Id;
    const { phoneNumber, email } = req.body;
    const con = await ContactUs.findById(conId);
    if (!con) {
      return res
        .status(400)
        .send({ success: false, message: "No ConID found on that number" });
    }
    con.phoneNumber = phoneNumber || con.phoneNumber;
    con.email = email || con.email;
    await con.save();

    res.status(200).send({ success: true, data: con });
  } catch (error) {
    console.error(error);
    re.status(500).send("Internal server error");
    throw error;
  }
});

router.get("/get/contact", async (req, res) => {
  try {
    const all = await ContactUs.find();
    if (all.lenght <= 0) {
      return res
        .status(400)
        .send({ success: false, message: "No Contact Number Found" });
    }
    res.status(200).send({ success: true, data: all });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

router.get("/get/contact/:Id", async (req, res) => {
  try {
    const con = req.params.Id;
    const all = await ContactUs.findById(con);
    if (!all) {
      return res
        .status(400)
        .send({ success: false, message: "No Contact Number Found" });
    }
    res.status(200).send({ success: true, data: all });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

router.delete("/get/contact/:Id", async (req, res) => {
  try {
    const con = req.params.Id;
    const all = await ContactUs.findByIdAndDelete(con);
    res
      .status(200)
      .send({ success: true, message: "Contact Number deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
