const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const weatherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true},
  city: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true},
  
});