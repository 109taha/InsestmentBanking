const JWT = require("jsonwebtoken");

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decryptedToken = JWT.verify(token, process.env.JWT_SEC_ADMIN);
    req.user = decryptedToken.userId;
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
    const decryptedToken = JWT.verify(token, process.env.JWT_SEC);
    req.user = decryptedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyBoth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decryptedToken = JWT.verify(token, process.env.JWT_SEC);
    if (decryptedToken) {
      req.user = decryptedToken.userId;
      next();
    }
    const decryptToken = JWT.verify(token, process.envJWT_SEC_ADMIN);
    if (decryptToken) {
      req.user = decryptedToken.userId;
      next();
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { verifyAdmin, verifyUser, verifyBoth };
