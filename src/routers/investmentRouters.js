const router = require("express").Router();
const Investment = require("../model/investmentSchema");
const { verifyAdmin, verifyUser } = require("../helper/middleware/verify");

router.post("/create", verifyAdmin, async (req, res) => {
  try {
    const { detail, planDuration, price } = req.body;
    if ((!detail, !price, !planDuration)) {
      return res
        .status(400)
        .send({ success: false, message: "You have to provide all the feild" });
    }
    const newInvestment = await new Investment({
      detail,
      planDuration,
      price,
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
    const { detail, planDuration, price } = req.body;
    const inv = await Investment.findById(invId);

    inv.detail = detail || inv.detail;
    inv.planDuration = planDuration || inv.planDuration;
    inv.price = price || inv.price;

    await inv.save();

    res.status(200).send({ success: true, data: inv });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
    throw error;
  }
});

router.get("/all", async (req, res) => {
  try {
    const allInv = await Investment.find();
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

router.get("/one/:Id", async (req, res) => {
  try {
    const invId = req.params.Id;
    const allInv = await Investment.findById(invId);
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

router.delete("/one/:Id", async (req, res) => {
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

module.exports = router;
