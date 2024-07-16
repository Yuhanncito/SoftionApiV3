import { Router } from "express";
import * as projectCotroller from '../controllers/project.controller'
import * as jws from "../middlewares/authJWT"
import * as verifyRole from "../middlewares/authRole"
const router = Router();
router.post('/',[jws.verifyToken,verifyRole.verifyRole],projectCotroller.insertProject);
router.get('/',jws.verifyToken,projectCotroller.getProjectsWithTaskUsers);
router.put('/:id',jws.verifyToken,projectCotroller.updateProject);
router.delete('/:id',[jws.verifyToken,verifyRole.verifyRole],projectCotroller.deleteProject)
router.get('/:id',jws.verifyToken,projectCotroller.getProjectsById)
export default router;