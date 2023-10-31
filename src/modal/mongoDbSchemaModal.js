const validator = require("validator");
const mongoose = require("mongoose");
const noteCollectionName = process.env.NOTE_COLLECTION;
const userCollectionName = process.env.USER_COLLECTION;

class mongoDbModal {
  static async notesModal() {
    const notesSchema = {
      title: {
        type: String,
        required: [true, "plz enter the title"],
        unique: true,
      },
      description: {
        type: String,
        required: [true, "plz provide the description"],
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userCollectionName,
        required: true,
      },
    };
    const schemaObject = new mongoose.Schema(notesSchema, { timestamps: true });
    return (
      mongoose.models[noteCollectionName] ||
      mongoose.model(noteCollectionName, schemaObject)
    );
  }

  static async userModal() {
    const usersSchema = {
      email: {
        type: String,
        require: [true, "enter your email"],
        unique: true,
        validate(value) {
          if (!validator.isEmail(value))
            throw new error("email is not correct");
        },
      },
      userName: {
        type: String,
        required: [true, "enter your username"],
      },
      password: {
        type: String,
        required: [true, "plz enter password"],
      },
      confirmPassword: {
        type: String,
        required: [true, "plz enter confirm password"],
      },
    };
    const schemaObject = new mongoose.Schema(usersSchema, { timestamps: true });
    return (
      mongoose.models[userCollectionName] ||
      mongoose.model(userCollectionName, schemaObject)
    );
  }
}

module.exports = mongoDbModal;
