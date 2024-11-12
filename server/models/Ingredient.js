import mongoose from "mongoose";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const CategorizeWithAI = async (ingredient) => {

    const prompt = `
    Classify the ingredient "${ingredient}" into one of the following categories, and return only the category name in JSON format:
    {
      "category": "categoryName"
    }

    Categories:
    1. meatProtein
    2. dairy
    3. vegetablesFruits
    4. grainsBread
    5. cannedPackagedGoods
    6. spicesSeasonings
    7. frozenFoods

    Definitions:
    - meatProtein: Includes all meats, fish, and plant-based protein sources.
    - dairy: Milk, cheese, yogurt, and other dairy products.
    - vegetablesFruits: Fresh fruits and vegetables.
    - grainsBread: Bread, rice, pasta, cereals, and similar items.
    - cannedPackagedGoods: Items that are shelf-stable and pre-packaged, such as canned beans, pasta sauces, and snacks.
    - spicesSeasonings: Herbs, spices, seasonings, and cooking additives.
    - frozenFoods: Any food item typically stored in the freezer, like frozen vegetables or ready-to-eat frozen meals.

    Ingredient to classify: "${ingredient}"
    Output:
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",

            messages: [
                { role: "system", content: "You are a helpful assistant that classifies ingredients." },
                { role: "user", content: prompt }
            ],
            max_tokens: 20,
            temperature: 0,
        });


        // Parse the JSON response from the model
        const outputText = response.choices[0].message.content.trim();
        const categoryJson = JSON.parse(outputText);
        console.log("info:" , outputText, categoryJson);

        return categoryJson;
    } catch (error) {
        console.error("Error classifying ingredient:", error);
        return { error: "Failed to classify ingredient" };
    }


}

const { Schema } = mongoose;
const ingredientSchema = new Schema(
    {
        name: {
            type: String,
            default: 'empty',
            required: true,
        },
        category: {
            type: String,
            default: 'misc',
            required: true,
        }

    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);


ingredientSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("name")) {
        const cat = await CategorizeWithAI(this.name);
        this.category = cat.category;
        
        console.log(this.category, cat.category);
    }
    next();
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);
export default Ingredient;