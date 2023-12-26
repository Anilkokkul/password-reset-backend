const Users = require("../models/users.model");
const Tokens = require("../models/token.model");

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendResetLink = require("../send-email/sendEmail");

exports.registerUser = async (req, res) => {
  try {
    const payload = req.body;

    const user = await Users.findOne({ email: payload.email });
    if (user) {
      return res.status(409).send({
        message: "An account is already registered with your email",
      });
    }

    const userWithMobile = await Users.findOne({
      mobileNumber: payload.mobileNumber,
    });
    if (userWithMobile) {
      return res.status(409).send({
        message: "An account is already registered with your mobile number",
      });
    }

    const hashedValue = await bcrypt.hash(payload.password, 10);
    payload.hashedPassword = hashedValue;
    delete payload.password;

    const newUser = new Users(payload);

    newUser
      .save()
      .then((data) => [
        res.status(201).send({
          message: "User Registered successfully",
          User: newUser,
        }),
      ])
      .catch((error) => {
        res.status(400).send({
          message: "Error occurred while creating the user",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await Users.findOne({ email: email });

    if (existingUser) {
      if (bcrypt.compareSync(password, existingUser.hashedPassword)) {
        return res.status(200).send({
          message: "User Logged-in Successfully",
        });
      }
      return res.status(400).send({
        message: "Incorrect Password!!",
        password: password,
      });
    }
    res.status(400).send({
      message: "Entered email is not a existing email id",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        message: "Please enter email",
      });
    }

    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(400).send({
        message: "This email is does not exist",
      });
    }

    let token = await Tokens.findOne({ userId: user._id });
    if (token) {
      await Tokens.deleteOne();
    }

    const newToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = await bcrypt.hash(newToken, 10);
    const tokenPayload = new Tokens({ userId: user._id, token: hashedToken });
    await tokenPayload.save();
    const link = `${process.env.BASE_DEV_URL}/reset-password?token=${newToken}&userId=${user._id}`;

    const isResetLinkSent = await sendResetLink(
      user.email,
      "Password reset Request",
      link
    );
    if (isResetLinkSent) {
      res
        .status(200)
        .send({ message: "Reset Password link Email Sent Successfully" });
    } else {
      res.status(550).send({
        message: "Error while sending email",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { userId, token, newPassword } = req.body;

    const resetToken = await Tokens.findOne({ userId: userId });

    if (!resetToken) {
      return res.status(404).send({
        message: "Password reset link has been expired or missing",
      });
    }
    const isValidToken = bcrypt.compareSync(token, resetToken.token);

    if (!isValidToken) {
      return res.status(404).send({ message: "Invalid Token" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await Users.findByIdAndUpdate(
      { _id: userId },
      { $set: { hashedPassword: hashedPassword } }
    )
      .then((data) => {
        res.status(200).send({
          message: "Password changed successfully",
          data: data,
        });
      })
      .catch((error) => {
        res
          .status(500)
          .json({ message: "internal server error", Error: error });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error,
    });
  }
};
