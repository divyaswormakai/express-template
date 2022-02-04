const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
  email: { type: String, unique: true },
  displayName: { type: String },
  subscriptionStatus: {
    type: String,
    enum: ["FREE", "PREMIUM", "SUPER"],
    default: "FREE",
  },
  lastPostDate: { type: Date },

  lastLoginDate: { type: Date, required: true, default: Date.now() },
  createdDate: { type: Date, required: true, default: Date.now() },
  updatedDate: { type: Date, required: true, default: Date.now() },
});

UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", UserSchema);
