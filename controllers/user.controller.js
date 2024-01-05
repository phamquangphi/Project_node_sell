const User = require("../model/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/jwt");
// CREATE TOKEN
// const createToken = async (id) => {
//   try {
//     const token = await jwt.sign({ _id: id }, config.secret_jwt);
//     return token;
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };
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
        const tokenData = await generateAccessToken(useData._id);
        const refreshToken = await generateRefreshToken(useData._id);
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
          maxAge: 7 * 24 * 60 * 60 * 1000,
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
//UPDATE PASSWORD
const updatePasswordUser = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const password = req.body.password;
    const data = await User.findOne({ _id: user_id });
    if (data) {
      const newPassword = await securePassword(password);
      const userData = await User.findByIdAndUpdate(
        { _id: user_id },
        {
          $set: {
            password: newPassword,
          },
        }
      );
      return res.status(200).send({
        success: true,
        massage: "Your password has been update",
        data: userData,
      });
    } else {
      return res
        .status(401)
        .send({ success: false, message: "User id not found!" });
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
const refreshAccessToken = async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie && !cookie.refreshToken)
      throw new Error("No refresh Token in cookies");
    jwt.verify(
      cookie.refreshToken,
      process.env.JWT_SECREST,
      async (err, decode) => {
        if (err) throw new Error("Invalid refresh token");
        const respone = await User.findById({
          _id: decode._id,
          refreshToken: cookie.refreshToken,
        });
        return res
          .status(200)
          .send({
            success: respone ? true : false,
            newAccessToken: respone
              ? generateAccessToken(respone._id, respone.role)
              : "Refresh token not matched",
          });
      }
    );
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Internal server error" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  updatePasswordUser,
  getcurrent,
  refreshAccessToken,
};
