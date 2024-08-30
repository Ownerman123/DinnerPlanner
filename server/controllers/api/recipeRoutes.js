import e from "express";
import { Recipe } from "../../models/index.js"


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

        const recipe = await Recipe.create(req.body);
        res.json(recipe);
    } catch (err) {
        res.json({ message: err })
    }


});

export default router;