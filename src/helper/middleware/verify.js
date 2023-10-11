const JWT = require("jsonwebtoken");
const JWT_SEC = "JoM2CF2k19Z0Jpwom6wkuFvKvNMQwuqiPHryaoJ";
const JWT_SEC_ADMIN = "CsJ6R8Y6XIPG0ayeyjaHP2FdozBgVBE0813SgEtQC5";

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decryptedToken = JWT.verify(token, JWT_SEC_ADMIN);
    req.body.userId = decryptedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decryptedToken = JWT.verify(token, JWT_SEC);
    req.user = decryptedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { verifyAdmin, verifyUser };
