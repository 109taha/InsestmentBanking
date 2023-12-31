const mongoose = require("mongoose");

const InvestmentSchema = new mongoose.Schema(
  {
    detail: {
      type: String,
      require: true,
    },
    planDuration: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    dailyWithrow: {
      type: Number,
      require: true,
    },
    userId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    adminAcc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminAcc",
      require: true,
    },
    contactUs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContactUs",
    },
  },
  { timestamps: true }
);

const Investment = mongoose.model("Investment", InvestmentSchema);

module.exports = Investment;
