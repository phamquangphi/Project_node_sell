const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const { verifyAccessToken } = require("../middleware/verifyToken");
const {
  registerUser,
  loginUser,
  updatePasswordUser,
  getcurrent,
  refreshAccessToken,
} = require("../controllers/user.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get("/test", auth, function (req, res) {
//   res.status(200).send({ success: true, massage: "Authenticated" });
// });
router.post("/update_password", updatePasswordUser);
router.get("/current", verifyAccessToken, getcurrent);
router.post("/refreshtoken", refreshAccessToken);

module.exports = router;
