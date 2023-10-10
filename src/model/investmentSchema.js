const mongoose = require("mongoose");

const InvestmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    detail: {
      type: String,
      require: true,
    },
    planDuration: {
      time: String,
    },
    price: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Investment = mongoose.model("Investment", InvestmentSchema);

module.exports = Investment;
