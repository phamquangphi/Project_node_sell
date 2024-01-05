const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyAccessToken = async (req, res, next) => {
  try {
    if (req?.headers?.authorization?.startsWith("Bearer")) {
      const token = await req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECREST, (err, decode) => {
        if (err)
          return res
            .status(401)
            .send({ success: false, message: "Invalid access token" });
        req.user = decode;
        next();
      });
    } else {
      return res
        .status(401)
        .send({ success: false, message: "Require authorization!!!" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};
module.exports = { verifyAccessToken };
