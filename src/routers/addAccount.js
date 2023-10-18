const router = require("express").Router();
const AdminAcc = require("../model/AdminAcc");
const { verifyAdmin } = require("../helper/middleware/verify");

router.post("/create/account", verifyAdmin, async (req, res) => {
  try {
    const { AccountNumber, AccountName, BankName } = req.body;
    if ((!AccountNumber, !AccountName, !BankName)) {
      return res.status(400).send({
        success: false,
        message: "You have to provide all the feild!",
      });
    }
    const createAcc = new AdminAcc({
      AccountNumber,
      AccountName,
      BankName,
    });
    await createAcc.save();
    res.status(200).send({ success: true, data: createAcc });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
    throw error;
  }
});

router.post("/update/account/:AccId", verifyAdmin, async (req, res) => {
  try {
    const accountId = req.params.AccId;
    const { AccountNumber, AccountName, BankName } = req.body;

    const updateAcc = await AdminAcc.findById(accountId);

    updateAcc.AccountNumber = AccountNumber || updateAcc.AccountNumber;
    updateAcc.AccountName = AccountName || updateAcc.AccountName;
    updateAcc.BankName = BankName || updateAcc.BankName;

    await updateAcc.save();
    res.status(200).send({
      success: true,
      message: "Back Detail Updated Successfully",
      data: updateAcc,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
    throw error;
  }
});

router.get("/acc", verifyAdmin, async (req, res) => {
  try {
    const allAcc = await AdminAcc.find();
    if (allAcc.length <= 0) {
      return res
        .status(500)
        .send({ success: false, message: "No bank account fouund!" });
    }
    res.status(200).send({ success: true, data: allAcc });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error !");
    throw error;
  }
});

router.get("/acc/:accId", async (req, res) => {
  try {
    const accId = req.params.accId;
    const allAcc = await AdminAcc.findById(accId);
    if (!allAcc) {
      return res
        .status(500)
        .send({ success: false, message: "No bank account fouund!" });
    }
    res.status(200).send({ success: true, data: allAcc });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error !");
    throw error;
  }
});

module.exports = router;
