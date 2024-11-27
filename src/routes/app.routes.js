import { Router } from "express";
import * as appController from '../controllers/app.controller'
const router = Router();

router.post('/',appController.saveData);

export default router;