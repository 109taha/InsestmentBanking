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
    status: {
      type: String,
      require: true,
      enum: ["Pending", "Seen"],
      default: "Pending",
    },
  },
  { timestamps: true }
);
const AddPayment = mongoose.model("AddPayment", AddPaymentSchema);

module.exports = AddPayment;
