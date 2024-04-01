const Product = require("../model/menu.model");

const createProduct = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(403).send("No image in the request");
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/imgaes`;
    const newProduct = new Product({
      namePr: req.body.namePr,
      image: `${basePath}${fileName}`,
      pricePr: req.body.pricePr,
    });
    const prodcut = await newProduct.save();
    if (!prodcut)
      return res
        .status(500)
        .json({ success: false, message: "the product cannot be created" });
    return res.status(200).json({
      success: true,
      data: prodcut,
    });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Internal server error" });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const prodcut = await Product.findById(id);
    return res.status(200).json({
      success: prodcut ? true : false,
      data: prodcut ? prodcut : "cannot get new product",
    });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Internal server error" });
  }
};
const getAllProduct = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    //Filtering
    const excludedFields = ["page", "sorts", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    //Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    //Hander product name search
    if (queryStr.namePr) {
      queryStr = JSON.stringify({
        namePr: { $regex: queryObj.namePr, $options: "i" },
        ...queryObj,
      });
    }
    //sorting
    const sortBy = req.query.sort || "-createdAt";

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Execute the query
    const query = Product.find(JSON.parse(queryStr))
      .sort(sortBy)
      .skip(skip)
      .limit(limit);
    const products = await query;

    // Calculate total number of documents for pagination
    const totalDocuments = await Product.countDocuments(JSON.parse(queryStr));
    return res.status(200).json({
      success: true,
      data: products,
      totalDocuments,
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / limit),
    });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Internal server error" });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id && !req.body.namePr) throw new Error("Product does not exist");
    const updatePr = await Product.findByIdAndUpdate(id, req.body);
    return res.status(200).json({
      success: updatePr ? true : false,
      data: updatePr ? updatePr : " cannot update product",
    });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Internal server error" });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletePr = await Product.findByIdAndDelete(id);
    return res.status(200).json({
      success: deletePr ? true : false,
      data: deletePr ? deletePr : "cannot delete product",
    });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
};
