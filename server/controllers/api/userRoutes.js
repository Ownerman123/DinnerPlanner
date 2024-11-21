import e from "express";
import { User, Recipe, Ingredient } from "../../models/index.js"
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});



const router = e.Router();

//  "/api/user"
router.get('/', async (req, res) => {
    try {
        const user = await User.find().select('-password');
        res.json({ users: user });
    } catch (error) {
        res.status(500).json({ message: error });
    }

});
router.delete('/', async (req, res) => {
    try {
        const deleted = await User.deleteOne({ username: req.body.username })
        res.json(deleted).status(201);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select('-password').populate('book').populate('plan');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error });
    }

});
router.post('/', async (req, res) => {
    try {

        const user = await User.create(req.body);
        res.json(user);

    } catch (err) {
        res.json({ message: err }).status(500);
    }


});
router.get('/book/:id', async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.params.id }).select('-password');

        res.json(user);

    } catch (err) {
        res.json({ message: err }).status(500);
    }
})
router.put('/book', async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.body.user });
        if (!user.book.includes(req.body.recipeId)) {
            user.book.push(req.body.recipeId);
            await user.save()
        }
        res.json(user);

    } catch (err) {
        res.json({ message: err }).status(500);
    }
})
router.delete('/book', async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.body.user });
        if (user.book.includes(req.body.recipeId)) {
            user.book.pull(req.body.recipeId);
            await user.save()
        }
        res.json(user);

    } catch (err) {
        res.json({ message: err }).status(500);
    }
});

router.put('/plan', async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.body.user }).populate('book');
        if (!user) {
            res.json({ message: "not logged in!" }).status(401);
        }

        if (user.book.length < req.body.mealcount) {
            throw new Error('Not enough recipes in the book to plan this many meals');
        }
        user.plan = [];

        const snacks = user.book.filter(recipe => recipe.snack === true);
        const meals = user.book.filter(recipe => recipe.snack === false);

        const randomMeals = getRandomItemsFromArray(meals, req.body.mealCount);
        const randomsnacks = getRandomItemsFromArray(snacks, req.body.snackCount);

        user.plan.push(...randomMeals, ...randomsnacks);
        user.planShopingList = await generateRecipeShoppingList(user.plan);
       
        await user.save();
       // console.log(user);

        const newplan = await User.findOne({ _id: req.body.user }).populate('book').populate('plan')
        res.json(newplan).status(200);


    } catch (error) {
        res.json({ message: error }).status(500);
    }

    function getRandomItemsFromArray(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
});
router.put('/plan/roll', async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.body.user }).populate('book').populate('plan');
        if (!user) {
            res.json({ message: "not logged in!" }).status(401);
        }

        let newRecipe;
        const recipeId = req.body.id;
        const recipe = user.plan.find(recipe => recipe._id.toString() === recipeId);
        const isSnack = recipe.snack;


        if (isSnack) {
            const bookRecipes = user.book.filter(rec => rec.snack);

            newRecipe = getRandomRecipe(bookRecipes, user.plan, recipe);
        } else {
            const bookRecipes = user.book.filter(rec => !rec.snack);
            newRecipe = getRandomRecipe(bookRecipes, user.plan, recipe);
        }



        user.plan.pull({ _id: req.body.id });
        user.plan.push(newRecipe);
        user.planShopingList = await generateRecipeShoppingList(user.plan.map(recipe => recipe._id));
        
        await user.save();

        const newplan = await User.findOne({ _id: req.body.user }).populate('book').populate('plan')
        res.json(newplan).status(200);


    } catch (error) {
        res.json({ message: error }).status(500);
    }

    function getRandomRecipe(book, plan, og) {
        // Filter the book list to remove recipes that are already in the shopping list
        const availableRecipes = book.filter(recipe =>
            !plan.some(item => item.id === recipe.id)
        );

        // If no available recipes left, return null (or handle accordingly)
        if (availableRecipes.length === 0) {
           // console.log('No more available recipes to add.');
            return og;
        }


        // Randomly pick one recipe from the filtered list
        const randomIndex = Math.floor(Math.random() * availableRecipes.length);
        return availableRecipes[randomIndex];
    }
});
router.put('/plan/add', async (req, res) => {
    try{

        const user = await User.findOne({ _id: req.body.user }).populate('book').populate('plan');
        if (!user) {
            res.json({ message: "not logged in!" }).status(401);
        }

        user.plan.push(req.body.newRecipe);
        user.planShopingList = await generateRecipeShoppingList(user.plan.map(recipe => recipe._id));
        
        await user.save();

        const newplan = await User.findOne({ _id: req.body.user }).populate('book').populate('plan')
        res.json(newplan).status(200);

    } catch (error) {
        res.json({ message: error }).status(500);
    }

});
router.put('/plan/remove', async (req, res) => {
    try {
        
        const user = await User.findOne({ _id: req.body.user }).populate('book').populate('plan');
        
        if (!user) {
            return res.status(401).json({ message: "Not logged in!" });
        }

        const recipeIndex = user.plan.findIndex(recipe => recipe._id.toString() === req.body.removeRecipe);

        // Remove only if the recipe exists in the array
        if (recipeIndex !== -1) {
            user.plan.splice(recipeIndex, 1); // Remove one instance of the recipe
        } else {
            return res.status(404).json({ message: "Recipe not found in the plan!" });
        }

        user.planShopingList = await generateRecipeShoppingList(user.plan.map(recipe => recipe._id));

        await user.save();

        const updatedUser = await User.findOne({ _id: req.body.user }).populate('book').populate('plan');
        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/list/misc', async (req, res) => {
try {

    const user = await User.findOne({ _id: req.body.user }).select('-password');
    user.miscShopingList = await generateMiscShoppingList(req.body.list);
    await user.save();
    res.json(user).status(200);
} catch (err) {
    res.json({message: err}).status(500);
}

});
router.put('/list/meal', async (req, res) => {
try {
   // console.log("list" ,req.body.list);
    const user = await User.findOne({ _id: req.body.user }).select('-password');
    user.planShopingList = req.body.list;
    await user.save();
    res.status(200).json(user);
} catch (err) {
    res.json({message: err}).status(500);
}

});

async function generateRecipeShoppingList(recipeIds) {
    try {
        // Fetch recipes by ids
        const recipes = await Recipe.find({ _id: { $in: recipeIds } }).populate('ingredients.ingredient').lean();
//console.log("RECIPES" ,recipes);
        const shoppingList = {};

        // Loop through each recipe and its ingredients
        recipes.forEach(recipe => {
            recipe.ingredients.forEach(({ingredient, name, amount, unit }) => {
                
                if (!shoppingList[name]) {
                    // If ingredient not in list, add it with the amount and unit
                    shoppingList[name] = [{ amount: parseFloat(amount) || 0 , unit, category: ingredient?.category || 'misc' }];
                   // console.log(ingredient?.category || 'no sir')
                } else {
                    // If ingredient exists, check if there's already an entry with the same unit
                    let ingredientEntry = shoppingList[name].find(entry => entry.unit === unit);

                    if (ingredientEntry) {
                        // If the unit is the same, add the amounts
                        ingredientEntry.amount = parseFloat(ingredientEntry.amount) + parseFloat(amount);
                    } else {
                        // If the unit is different, create a new entry for that unit
                        shoppingList[name].push({ amount, unit });
                    }
                }
            });
        });

        // The shoppingList object now contains ingredients grouped by name, with units and amounts combined
        const formattedShoppingList = Object.keys(shoppingList).map(name => ({
            name,
            category: shoppingList[name][0]?.category  || 'misc',
            amounts: shoppingList[name] // Assign the array of { amount, unit } objects directly
        }));
//console.log(formattedShoppingList);
        return formattedShoppingList;

    } catch (error) {
        console.error("Error generating shopping list:", error);
    }
}
async function generateMiscShoppingList(items) {
    try {
    
        const shoppingList = {};

            items.forEach(({ name, amount, unit }) => {
                
                if (!shoppingList[name]) {
                    // If ingredient not in list, add it with the amount and unit
                    shoppingList[name] = [{ amount, unit }];
                } else {
                    // If ingredient exists, check if there's already an entry with the same unit
                    let ingredientEntry = shoppingList[name].find(entry => entry.unit === unit);

                    if (ingredientEntry) {
                        // If the unit is the same, add the amounts
                        ingredientEntry.amount = parseFloat(ingredientEntry.amount) + parseFloat(amount);
                    } else {
                        // If the unit is different, create a new entry for that unit
                        shoppingList[name].push({ amount, unit });
                    }
                }
            });
       
        // The shoppingList object now contains ingredients grouped by name, with units and amounts combined
        const formattedShoppingList = Object.keys(shoppingList).map(name => ({
            name,
            amounts: shoppingList[name] // Assign the array of { amount, unit } objects directly
        }));

        return formattedShoppingList;

    } catch (error) {
        console.error("Error generating shopping list:", error);
    }
}

export default router;

