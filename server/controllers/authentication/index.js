import e from "express";
import authRoutes from "./userAuthRoutes.js";

const router = e.Router();

router.use('/', authRoutes);


export default router;