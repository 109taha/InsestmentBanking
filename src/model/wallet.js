const mongoose = require("mongoose");

const WalletSchema = await mongoose.Schema({
  amount: {
    type: Number,
    default: 0,
  },
  userId: {
    type: String,
    ref: "User",
    require: true,
  },
});
const Wallet = mongoose.model("Wallet", WalletSchema);

module.exports = Wallet;
