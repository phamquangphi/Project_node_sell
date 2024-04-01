const User = require("../model/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/jwt");
require("dotenv").config();
// HASH PASSWORD
const securePassword = async (pw) => {
  try {
    const passwordHash = await bcryptjs.hash(pw, 10);
    return passwordHash;
  } catch (error) {
    error.message;
  }
};
//REGISTER
const registerUser = async (req, res) => {
  try {
    const hashedPassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
    });
    const userData = await User.findOne({ email: req.body.email });
    if (!userData) {
      await user.save();
      return res.status(200).send({ success: true, data: user });
    } else {
      
      return res
        .status(401)
        .send({ success: false, message: "this email is already exists" });
    }
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Internal server error" });
  }
};
//login
const loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const useData = await User.findOne({ email: email });
    if (useData) {
      const passwordMatch = await bcryptjs.compare(password, useData.password);
      if (passwordMatch) {
        const tokenData = await generateAccessToken(useData._id, useData.roles);
        const refreshToken = await generateRefreshToken(
          useData._id,
          useData.roles
        );
        await User.findByIdAndUpdate(
          useData._id,
          { refreshToken },
          { new: true }
        );
        const userResult = {
          _id: useData._id,
          name: useData.name,
          email: useData.email,
          password: useData.password,
          phone: useData.phone,
        };
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
          // maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).send({
          success: true,
          message: "User login success",
          data: userResult,
          accessToken: tokenData,
        });
      } else {
        return res
          .status(401)
          .send({ success: false, message: "Login details are incorrect" });
      }
    } else {
      return res
        .status(401)
        .send({ success: false, message: "Login details are incorrect" });
    }
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Internal server error" });
  }
};

// GET CURRENT
const getcurrent = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).select("-refreshToken -password");
    return res
      .status(200)
      .send({ success: false, rs: user ? user : "User not found" });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, message: "Internal server error" });
  }
};
// REFRESH TOKEN
const requestRefreshAccessToken = async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie && !cookie.refreshToken)
      return res.status(401).json("no refresh token in cookie");
    const rs = jwt.verify(cookie.refreshToken, process.env.JWT_REFRESH_KEY);
    const response = await User.findOne({
      _id: rs._id,
      refreshToken: cookie.refreshToken,
    });
    const newAccessToken = await generateAccessToken(
      response._id,
      response.roles
    );
    return res
      .status(200)
      .json({ success: true, newAccessToken: newAccessToken });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Internal server error" });
  }
};
//LOGOUT USER
const logoutUser = async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie || !cookie.refreshToken)
      throw new Error("No refresh token in cookies");
    //xóa refreshtoken ở db
    await User.findOneAndUpdate(
      { refreshToken: cookie.refreshToken },
      { refreshToken: "" },
      { new: true }
    );
    //xóa refreshtoken ở cookie trình duyệt
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
    });
    return res.status(200).json({ success: true, massage: "logout success" });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Internal server error" });
  }
};
const updateUserAddress = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!req.body.address) throw new Error("Missing input");
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { address: req.body.address } },
      { new: true }
    );
    if (!response)
      return res
        .status(401)
        .json({ success: false, message: "some thing went wrong" });
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getcurrent,
  requestRefreshAccessToken,
  updateUserAddress,
};
