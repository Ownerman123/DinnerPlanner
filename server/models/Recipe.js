import mongoose from "mongoose";
import User from './User.js'


const { Schema } = mongoose;
const recipeSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        ingredients: [
            {
                name:{
                    type: String,
                    trim: true,
                } ,
                amount: {
                    type: String,
                    trim: true,
                },
                unit: {
                    type: String,
                }

            }
        ],
        instructions: {
            type: String,
            trim: true,
        },
        snack:{
            type: Boolean,
        },
        tags: [
            {
                type: Schema.Types.ObjectId,
                ref: "Tag"
            }
        ]
        
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

recipeSchema.pre('findOneAndDelete', async function (next) {
    const recipeId = this.getQuery()._id;
  
    try {
      // Remove the recipe from all users' books
      await User.updateMany(
        { book: recipeId }, // Find users with this recipe in their book
        { $pull: { book: recipeId } } // Remove the recipe from their book
      );
  
      next();
    } catch (error) {
      next(error);
    }
  });


const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;