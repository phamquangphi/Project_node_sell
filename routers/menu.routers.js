const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const path = require("path");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const { verifyAccessToken } = require("../middleware/verifyToken");
const multer = require("multer");
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const invalid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (invalid) {
      uploadError = null;
    }
    cb(null, "public/imgaes");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });
const {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/menu.controllers");
router.post(
  "/createProduct",
  verifyAccessToken,
  uploadOptions.single("image"),
  createProduct
);
router.get("/getAllProduct", getAllProduct);
router.get("/getProduct/:id", getProduct);
router.put("/updateProduct/:id", verifyAccessToken, updateProduct);
router.delete("/deleteProduct/:id", verifyAccessToken, deleteProduct);

module.exports = router;
