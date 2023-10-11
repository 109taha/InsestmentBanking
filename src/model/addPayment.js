const mongoose = require("mongoose");

const AddPaymentSchema = new mongoose.Schema(
  {
    attachProved: {
      type: String,
      require: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);
const AddPayment = mongoose.model("AddPayment", AddPaymentSchema);

module.exports = AddPayment;
