const mongoose = require("mongoose");

const ContactUsSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      require: true,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

const ContactUs = mongoose.model("ContactUs", ContactUsSchema);

module.exports = ContactUs;
