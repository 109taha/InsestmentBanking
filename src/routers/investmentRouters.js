const router = require("express").Router();
const Investment = require("../model/investmentSchema");

router.post("/create", async (req, res) => {
  try {
    const { title, detail, planDuration, price } = req.body;
    if ((!title, detail, price)) {
      return res
        .status(400)
        .send({ success: false, message: "You have to provide all the feild" });
    }
    const newInvestment = await new Investment({
      title,
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

module.exports = router;
