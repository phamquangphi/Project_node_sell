const mongoose = require("mongoose");
require("dotenv").config();
async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("connect DB success");
  } catch (error) {
    console.log(error.nessage);
  }
}
module.exports = connectDB;
