import express from "express";
import apiroutes from './api/index.js';
import authroutes from './authentication/index.js'

const router = express.Router();

router.use('/api', apiroutes);
router.use('/auth', authroutes);

export default router;
