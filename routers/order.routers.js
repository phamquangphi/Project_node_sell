const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const { verifyAccessToken } = require("../middleware/verifyToken");
const { createOrder } = require("../controllers/cart.controllers");
router.post("/createOrder", verifyAccessToken, createOrder);
module.exports = router;
