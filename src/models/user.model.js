import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "usuario", "premium"],
    default: "usuario",
  },
  resetToken: {
    token: String,
    expire: Date,
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
