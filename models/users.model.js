const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Entered email is already registered"],
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
  },
  hashedPassword: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Users", userSchema);
