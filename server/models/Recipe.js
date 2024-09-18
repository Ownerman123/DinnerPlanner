import mongoose from "mongoose";


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




const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;