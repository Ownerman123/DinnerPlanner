import mongoose from "mongoose";


const { Schema } = mongoose;
const recipeSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        ingredients: [
            {
                type: String

            }
        ],
        instructions: {
            type: String,
            trim: true,
        }

    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);




const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;