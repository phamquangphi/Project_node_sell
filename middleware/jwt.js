const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = async (uid, role) => {
  try {
    const token = await jwt.sign({ _id: uid, role }, process.env.JWT_SECREST, {
      expiresIn: "15s",
    });
    return token;
  } catch (error) {
    error.message;
  }
};
const generateRefreshToken = async (uid) => {
  try {
    const token = await jwt.sign({ _id: uid }, process.env.JWT_SECREST, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    error.message;
  }
};
module.exports = { generateAccessToken, generateRefreshToken };
