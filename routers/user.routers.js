const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const { verifyAccessToken } = require("../middleware/verifyToken");
const {
  registerUser,
  loginUser,
  logoutUser,
  getcurrent,
  requestRefreshAccessToken,
  updateUserAddress,
} = require("../controllers/user.controller");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/current", verifyAccessToken, getcurrent);
router.post("/refreshtoken", requestRefreshAccessToken);
router.put("/updateAddress", verifyAccessToken, updateUserAddress);

module.exports = router;
