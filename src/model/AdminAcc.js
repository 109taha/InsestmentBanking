const mongoose = require("mongoose");

const AdminAccSchema = new mongoose.Schema(
  {
    AccountNumber: {
      type: String,
      require: true,
    },
    AccountName: {
      type: String,
      require: true,
    },
    BankName: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);
const AdminAcc = mongoose.model("AdminAcc", AdminAccSchema);

module.exports = AdminAcc;
