const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, unique: true },
  email: { type: String, unqiue: true },
  password: { type: String, unique: true },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
