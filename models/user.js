const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      validate: {
        validator: pass => {
          let regex = /^(?=.{5,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W])/;
          return regex.test(pass);
        },
        message:
          "Password must have one uppercase, lowercase, number, and a minimum length of 6 characters"
      }
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", function(next) {
  const saltRounds = 10;
  bcrypt
    .hash(this.password, saltRounds)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(err => {
      console.log(err.message);
    });
});

module.exports = mongoose.model("User", userSchema);
