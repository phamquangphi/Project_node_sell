const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
// const auth = require("../middleware/auth");

const {
  createProduct,
  getProduct,
  deleteProduct,
} = require("../controllers/menu.controllers");
router.post("/createProduct", createProduct);
router.get("/getProduct", getProduct);
router.delete("/deletProduct/:id", deleteProduct);
module.exports = router;
