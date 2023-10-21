const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: 0,
  },
  profit: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
});
const Wallet = mongoose.model("Wallet", WalletSchema);

module.exports = Wallet;
