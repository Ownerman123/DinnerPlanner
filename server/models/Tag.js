import mongoose, { Types } from "mongoose";



const { Schema } = mongoose;
const tagSchema = new Schema(
  {
    tag: {
      type: String,
      unique: true,

    },
    recipes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Recipe"
        }
    ]
    
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);




const Tag = mongoose.model("Tag", tagSchema);
export default Tag;