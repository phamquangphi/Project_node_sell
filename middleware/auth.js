// const jwt = require("jsonwebtoken");
// const config = require("../config/config");
// const verifyToken = async (req, res, next) => {
//   const token =
//     req.body.token || req.query.token || req.headers["authorization"];
//   if (!token) {
//     return res.status(401).send({
//       success: false,
//       message: "A token is required for authorization",
//     });
//   }
//   try {
//     const descode = jwt.verify(token, config.secret_jwt);
//     req.user = descode;
//   } catch (error) {
//     return res.status(400).send({ success: false, message: "Invalid Token" });
//   }
//   return next();
// };

// module.exports = verifyToken;
