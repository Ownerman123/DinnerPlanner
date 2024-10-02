import e from "express";
import { Recipe, Tag, User } from "../../models/index.js"


const router = e.Router();

//  "/api/recipe"
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('tags').populate('author', 'username');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error });
    }

});
router.get('/user/:id', async (req, res) => {
    try {
        const recipes = await Recipe.find({ author: req.params.id }).populate('tags').populate('author', 'username');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error });
    }

});
router.get('/book/:id', async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        const recipes = await Recipe.find({ _id: { $in: user.book } }).populate('tags').populate('author', 'username');

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error });
    }

});
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('author', 'username').populate('tags');
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error });
    }

});
router.post('/', async (req, res) => {
    try {

        const recipe = await Recipe.create({ ...req.body, tags: [] });
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
        res.json(recipe).status(200);
    } catch (err) {
        res.json({ message: err }).status(400);
    }


});
router.put('/', async (req, res) => {
    try {

        const recipe = await Recipe.findOne({ _id: req.body._id });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
          }
        recipe.ingredients = req.body.ingredients;
        recipe.title = req.body.title;
        recipe.instructions = req.body.instructions;
        recipe.snack = req.body.snack;

        recipe.tags = [];
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
        res.status(400).json({ message: err }).status(400);
    }


});
router.delete('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        res.json({message:`Recipe ${recipe} deleted successfully`});
    } catch (error) {
        res.status(500).json({ message: error });
    }

});

export default router;