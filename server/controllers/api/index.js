import e from "express";
import userRoutes from "./userRoutes.js"
import recipeRoutes from "./recipeRoutes.js"

const router = e.Router();

//  "/api"

router.use("/user", userRoutes);
router.use("/recipe", recipeRoutes)
export default router;

