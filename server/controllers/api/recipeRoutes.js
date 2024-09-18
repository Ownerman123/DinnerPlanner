import e from "express";
import { Recipe, Tag, User } from "../../models/index.js"


const router = e.Router();

//  "/api/recipe"
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error });
    }

});
router.get('/user/:id', async (req, res) => {
    try {
        const recipes = await Recipe.find({ author: req.params.id });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error });
    }

});
router.get('/book/:id', async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        const recipes = await Recipe.find({ _id: { $in: user.book } });

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error });
    }

});
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
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

export default router;