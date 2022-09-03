const bcrypt = require("bcrypt");
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      //match: [/.+@.+\..+/, "Must match an email address!"],
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      city:{
        type: String,
      },
      state:{
        type: String,
      }
    },
    gardens: [
      {
        type: Schema.Types.ObjectId,
        ref: "Garden",
      },
    ],
    plants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Plant",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
  });

  // compare the incoming password with the hashed password
  userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

const User = model("User", userSchema);
module.exports = User;
