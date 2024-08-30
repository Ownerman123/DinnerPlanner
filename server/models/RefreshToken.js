import mongoose from "mongoose";


const { Schema } = mongoose;
const tokenSchema = new Schema(
  {
    token: {
      type: String,

    },
    
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);




const RefreshToken = mongoose.model("RefreshToken", tokenSchema);
export default RefreshToken;