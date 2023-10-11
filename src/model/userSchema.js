const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      require: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: Number,
      require: true,
    },
    devicetoken: {
      type: String,
    },
    profile_pic: {
      type: String,
    },
    amount: {
      type: Number,
      default: 0,
    },
    investmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
    },
    userBank: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
