import e from "express";
import { Recipe, Tag, User, Ingredient } from "../../models/index.js"
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });



const router = e.Router();

//  "/api/recipe"
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('tags').populate('author', 'username').populate('ingredients.ingredient');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error });
    }

});
router.get('/user/:id', async (req, res) => {
    try {
        const recipes = await Recipe.find({ author: req.params.id }).populate('tags').populate('author', 'username').populate('ingredients.ingredient');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error });
    }

});
router.get('/book/:id', async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        const recipes = await Recipe.find({ _id: { $in: user.book } }).populate('tags').populate('author', 'username').populate('ingredients.ingredient');

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error });
    }

});
router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.q; // Search term from query params
        if(searchTerm === ''){
            res.status(200).json({message: 'no search term'});
            return;
        }
        let recipes;
        let taggedRecipes;
        let recipesFromTags = [];
        let recipeids = [];
        let results;


        // Avoid trying to match against _id, instead use Atlas Search or regex on string fields
        recipes = await Recipe.aggregate([
            {
                $search: {
                    index: 'default', // Your Atlas Search index name
                    text: {
                        query: searchTerm,
                        path: ['title', 'ingredients.name', 'instructions',], // Fields to search on
                    },
                },
            },
            {
                $limit: 50, // Limit the number of results
            }, 
            {
                $project: {
                    populatedTags: 1,
                    score: { $meta: 'searchScore' }, // Optionally include search score
                },
            },
        ]);

        taggedRecipes = await Tag.aggregate([
            {
                $search: {
                    index: 'tags', // Your Atlas Search index name
                    text: {
                        query: searchTerm,
                        path: ['title', 'ingredients.name', 'instructions',], // Fields to search on
                    },
                },
            },
            {
                $limit: 50, // Limit the number of results
            },

            {
                $project: {
                    recipes: 1,
                    score: { $meta: 'searchScore' }, // Optionally include search score
                },
            },
        ]);

        for (let i = 0; i < recipes.length; i++) {
            recipeids.push(recipes[i]._id);
        }

        for (let i = 0; i < taggedRecipes.length; i++) {
            recipesFromTags = [...recipesFromTags, ...taggedRecipes[i].recipes];
        }
        for (let i = 0; i < recipesFromTags.length; i++) {
            if (recipeids.includes(recipesFromTags[i])) {
                recipeids.push(recipesFromTags[i]);
            }
        }

        results = await Recipe.find({ _id: { $in: recipeids } }).populate('tags').populate('ingredients.ingredient');

        res.status(200).json(results);
    } catch (err) {
        console.error('Error in search:', err);
        res.status(500).json({ error: err.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('author', 'username').populate('tags').populate('ingredients.ingredient');
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error });
    }

});
router.post('/', async (req, res) => {
    try {

        const recipe = await Recipe.create({ ...req.body, tags: [] });
    const categorizedIngredients = [];
        //Handle ingredient categorization
        for(let ingredientData of recipe.ingredients){

            if(ingredientData.ingredient){
                categorizedIngredients.push(ingredient);
                console.log("already categorized");
                
            }
            const alreadyExists  = await Ingredient.find({name: ingredientData.name});
            if(alreadyExists.length !== 0) {
                console.log("no new ingredient created", alreadyExists);
                const newIngredientData = {
                    ingredient: alreadyExists[0]._id,
                    name: ingredientData.name,
                    amount: ingredientData.amount,
                    unit: ingredientData.unit,
                  };
                  
                  console.log("ingredient data" ,newIngredientData.ingredient);
                  categorizedIngredients.push(newIngredientData);
            }else{

                
                const newIngredient = await Ingredient.create({name: ingredientData.name});
                
                // Transform old ingredient format to new model format
                const newIngredientData = {
                    ingredient: newIngredient,
                    name: ingredientData.name,
                    amount: ingredientData.amount,
                    unit: ingredientData.unit,
                };
                
                
                // Store the new ingredient's ID (or other identifier)
                categorizedIngredients.push(newIngredientData);
            }
        }
            
            // Update the recipe with the new ingredient references
            recipe.ingredients = categorizedIngredients;

        if (req.body.image) {
            const base64String = req.body.image;
            const matches = base64String.match(/^data:(image\/\w+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                return res.status(400).json({ message: "Invalid image format" });
            }

            const base64Data = matches[2]; // Extract base64 data (after MIME type)
            const buffer = Buffer.from(base64Data, 'base64'); // Convert base64 to buffer

            // Upload to Cloudinary
            const url = await uploadToCloudinary(buffer);

            recipe.imgUrl = url; // Save the image URL in the recipe object
            await recipe.save(); // Ensure imgUrl is saved to the database

        }

        if (req.body.tags && req.body.tags.length > 0) {
            const inputTags = req.body.tags; // Array of tag names

            for (const tagName of inputTags) {
                let tag = await Tag.findOne({ tag: tagName.trim() }); // Find tag by name


                if (!tag) {
                    // Tag doesn't exist, create a new one
                    tag = await Tag.create({ tag: tagName.trim(), recipes: [recipe._id] });
                    recipe.tags.push(tag._id);
                    await recipe.save();
                } else {
                    // Tag exists, add the recipe to the tag's `recipes` array if not already present
                    if (!tag.recipes.includes(recipe._id)) {
                        tag.recipes.push(recipe._id);
                        recipe.tags.push(tag._id);
                        await recipe.save();
                        await tag.save();

                    }
                }
            }
        }
        console.log(recipe);
        res.json(recipe).status(200);
    } catch (err) {
        console.error("Error in recipe creation:", err); // Log the actual error for debugging
        res.status(400).json({ message: err.message || "An error occurred" });
    }


});
router.put('/', async (req, res) => {
    try {
        // Find the recipe by its _id
        const recipe = await Recipe.findOne({ _id: req.body._id });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Update recipe fields
        recipe.ingredients = req.body.ingredients;
        recipe.title = req.body.title;
        recipe.instructions = req.body.instructions;
        recipe.snack = req.body.snack;
        
        const categorizedIngredients = [];
        //Handle ingredient categorization
        for(let ingredientData of recipe.ingredients){

            if(ingredientData.ingredient){
                categorizedIngredients.push(ingredient);
                console.log("already categorized");
                
            }
            const alreadyExists  = await Ingredient.find({name: ingredientData.name});
            if(alreadyExists.length !== 0) {
                console.log("no new ingredient created", alreadyExists);
                const newIngredientData = {
                    ingredient: alreadyExists[0]._id,
                    name: ingredientData.name,
                    amount: ingredientData.amount,
                    unit: ingredientData.unit,
                  };
                  
                  console.log("ingredient data" ,newIngredientData.ingredient);
                  categorizedIngredients.push(newIngredientData);
            }else{

                
                const newIngredient = await Ingredient.create({name: ingredientData.name});
                
                // Transform old ingredient format to new model format
                const newIngredientData = {
                    ingredient: newIngredient,
                    name: ingredientData.name,
                    amount: ingredientData.amount,
                    unit: ingredientData.unit,
                };
                
                
                // Store the new ingredient's ID (or other identifier)
                categorizedIngredients.push(newIngredientData);
            }
        }
            
            // Update the recipe with the new ingredient references
            recipe.ingredients = categorizedIngredients;
            
        
        
        // Handle base64 image upload if provided
        if (req.body.image) {
            const base64String = req.body.image;
            const matches = base64String.match(/^data:(image\/\w+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                return res.status(400).json({ message: "Invalid image format" });
            }

            const base64Data = matches[2]; // Extract base64 data (after MIME type)
            const buffer = Buffer.from(base64Data, 'base64'); // Convert base64 to buffer

            // Upload to Cloudinary
            const url = await uploadToCloudinary(buffer);
            recipe.imgUrl = url; // Save the image URL in the recipe object
        }

        // Handle tags
        recipe.tags = [];
        if (req.body.tags && req.body.tags.length > 0) {
            const inputTags = req.body.tags; // Array of tag names

            for (const tagName of inputTags) {
                let tag = await Tag.findOne({ tag: tagName.trim() }); // Find tag by name

                if (!tag) {
                    // Tag doesn't exist, create a new one
                    tag = await Tag.create({ tag: tagName.trim(), recipes: [recipe._id] });
                    recipe.tags.push(tag._id);
                } else {
                    // Tag exists, add the recipe to the tag's `recipes` array if not already present
                    recipe.tags.push(tag._id);
                    if (!tag.recipes.includes(recipe._id)) {
                        tag.recipes.push(recipe._id);
                        await tag.save();
                    }
                }
            }
        }

        console.log(recipe);
        await recipe.save();
        res.status(200).json(recipe);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: `Recipe ${recipe} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: error });
    }

});

router.put('/migrate', async (req, res) => {
    console.log('hit');
    try {
        const recipes = await Recipe.find({_id: '67094fcb6410a7a1544c5b78' });
        recipes.forEach(async recipe => {
            const newIngredients = [];

            for (let oldIngredient of recipe.ingredients) {
                // Save the new ingredient to the Ingredient model
                if(oldIngredient.ingredient){
                    newIngredients.push(oldIngredient);
                    console.log("already formatted");
                    return;
                }
                const alreadyExists  = await Ingredient.find({name: oldIngredient.name});
                if(alreadyExists.length !== 0) {
                    const newIngredientData = {
                        ingredient: alreadyExists._id,
                        name: oldIngredient.name,
                        amount: oldIngredient.amount,
                        unit: oldIngredient.unit,
                      };
                      console.log("old amount:", oldIngredient.amount);
                      console.log("old name:", oldIngredient.name);
                      console.log("old unit:", oldIngredient.unit);

                      newIngredients.push(newIngredientData);
                }else{

                    
                    const newIngredient = await Ingredient.create({name: oldIngredient.name});
                    
                    // Transform old ingredient format to new model format
                    const newIngredientData = {
                        ingredient: newIngredient,
                        name: oldIngredient.name,
                        amount: oldIngredient.amount,
                        unit: oldIngredient.unit,
                    };
                    
                    
                    // Store the new ingredient's ID (or other identifier)
                    newIngredients.push(newIngredientData);
                }
            }
                
                // Update the recipe with the new ingredient references
                recipe.ingredients = newIngredients;
                await recipe.save();
            });
        res.json({ message: `Recipe ingredients migrated successfully` });
    } catch (error) {
        res.status(500).json({ message: error });
    }

})


export default router;