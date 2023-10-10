const express = require("express");
const app = express();
require("dotenv").config();

const dbConfig = require("./dbconfig/dbConfig");
dbConfig();

const PORT = process.env.PORT || "5000";
app.listen(PORT, () => {
  try {
    console.log(`Server is running on Port: ${PORT}`);
  } catch (error) {
    console.log("Server has some issue");
  }
});

const investment = require("./routers/investmentRouters");
const user = require("./routers/userRouters");
app.use("/investment", investment);
app.use("/", user);
