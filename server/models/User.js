import mongoose from "mongoose";
import bcrypt from "bcrypt";


const { Schema } = mongoose;
const ingredientSchema = new mongoose.Schema({
  ingredient: {

    type: Schema.Types.ObjectId,
    ref: "Ingredient"

  },
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  amounts: [
    {
      amount: {
        type: Number,

      },
      unit: {
        type: String,

      }
    }
  ],
  checked: {
    type: Boolean,
    default: false,
  }
});

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must match an email address!"],
    },
    book: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe"
      }
    ],
    plan: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe"
      }
    ],
    planShopingList: {

      type: [ingredientSchema]

    }
    ,
    
    miscShopingList: {

      type: [ingredientSchema]

    }
    ,
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);




// Set up pre-save middleware to create password.
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});
// Compare the incoming password with the hashed password.
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;