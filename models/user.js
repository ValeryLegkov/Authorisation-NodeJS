const { Schema, model } = require("mongoose");

const User = new Schema({
  username: { type: String, unique: true, required: true },
  pasword: { type: String, required: true },
  role: [{ type: String, ref: "Role" }],
});

module.exports = model("User", User);
