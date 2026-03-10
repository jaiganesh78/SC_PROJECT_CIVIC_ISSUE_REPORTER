const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: null, // null for Google users
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    phone: {
  type: String,
  required: false,
  default: null,
},

    googleId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
  type: String,
  enum: ["user", "admin", "staff"],
  default: "user",
},

trust_score: {
  type: Number,
  default: 100,
  min:0,
  max:100,
},

is_banned: {
  type: Boolean,
  default: false,
},

ban_until: {
  type: Date,
  default: null,
},


  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
