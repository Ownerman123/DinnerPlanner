import e from "express";
import { User } from "../../models/index.js"


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
})
router.delete('/', async (req, res) => {
    try {
        const deleted = await User.deleteOne({ username: req.body.username })
        res.json(deleted).status(201);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

export default router;

