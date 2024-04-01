const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = async (uid, role) => {
  try {
    const token = await jwt.sign(
      { _id: uid, role },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "2d",
      }
    );
    return token;
  } catch (error) {
    error.message;
  }
};
const generateRefreshToken = async (uid, role) => {
  try {
    const token = await jwt.sign(
      { _id: uid, role },
      process.env.JWT_REFRESH_KEY,
      {
        expiresIn: "1y",
      }
    );
    return token;
  } catch (error) {
    error.message;
  }
};
module.exports = { generateAccessToken, generateRefreshToken };
