const mongoose = require("mongoose");

const ContactUsSchema = new mongoose.Schema(
  {
    PhoneNumber: {
      type: String,
      require: true,
    },
    Email: {
      type: String,
    },
  },
  { timestamps: true }
);

const ContactUs = mongoose.model("ContactUs", ContactUsSchema);

module.exports = ContactUs;
