const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const MessageSchema = mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, required: true },
  to: { type: String, required: true },
  name: { type: String, required: true },
  videoLink: { type: String, required: true },
  message: { type: String },

  messsageTime: { type: Date, required: true },

  createdDate: { type: Date, required: true, default: Date.now() },
  updatedDate: { type: Date, required: true, default: Date.now() },
});

MessageSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

MessageSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Message", MessageSchema);
