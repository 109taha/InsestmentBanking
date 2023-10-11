const cors = require("cors");
const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//cors
app.use(
  cors({
    origin: "*",
  })
);

// connect mongodb
const MongoDB = require("./dbconfig/dbConfig");
MongoDB();

// Port
PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});

app.get("/", (req, res) => {
  res.status(200).send({ success: ture, message: "News Server Is Running" });
});
const investment = require("./routers/investmentRouters");
const user = require("./routers/userRouters");
const payments = require("./routers/addpayment");
app.use("/investment", investment);
app.use("/", user);
app.use("/payment", payments);
