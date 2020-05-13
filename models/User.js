const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  role: {
    type: Text,
    enum: ["kid", "teacher"],
  },
  matches: [
    {
      type: Schema.Types.ObjectId,
      ref: "Match",
    },
  ],
});

const User = model("User", userSchema);

module.exports = User;