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
      enum: [
        "Meezan Bank Limited",
        "Al Baraka Bank",
        "Allied Bank",
        "APNA Microfinance",
        "Askari Bank",
        "Bank Al-Habib",
        "Bank Alfalah",
        "Bank Of Khyber",
        "Bank Of Punjab",
        "Bankislami",
        "Central Depository Company",
        "Digitt Plus",
        "Dubai Islamic",
        "EasyPaisa-Telenor Bank",
        "Faysal Bank",
        "FINCA SimSim Wallet",
        "FINJA",
        "First Women Bank",
        "FirstPay/HBL MFB",
        "Habib Metro",
        "HBL KONNECT",
        "ICBC Pakistan",
        "JS Bank",
        "KEENU",
        "Khushhali Microfinance Bank",
        "MCB Islamic",
        "Mobilink Bank/JazzCash",
        "MCB",
        "NBP",
        "National Savings",
        "NayaPay",
        "NRSP BankForiCash",
        "OneZapp",
        "PayMax",
        "SadaPay",
        "Samba Bank",
        "Silk Bank",
        "Sindh Bank",
        "Soneri Bank",
        "Standard Chartered",
        "Summit Bank",
        "UBank/UPaisa",
        "UBL",
        "Zarai Taraqiati Bank",
      ],
    },
  },
  { timestamps: true }
);
const AdminAcc = mongoose.model("AdminAcc", AdminAccSchema);

module.exports = AdminAcc;
