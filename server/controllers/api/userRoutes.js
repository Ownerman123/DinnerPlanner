import e from "express";
import { User } from "../../models/index.js"


const router = e.Router();

//  "/api/user"
router.get('/', async (req, res) => {
    try {
        const user = await User.find();
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
        res.json({ message: err })
    }


});

export default router;

