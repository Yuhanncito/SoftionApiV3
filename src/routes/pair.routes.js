import { Router } from "express";
import  * as pairController from "../controllers/user.controller";
const router = Router();

router.get('/',pairController.pairCode);
router.post('/',pairController.loginPairCode);

export default router;