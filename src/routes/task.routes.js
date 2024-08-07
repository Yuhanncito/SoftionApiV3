import { Router } from "express";
import * as tasksCotroller from "../controllers/task.cotroller"
import * as jws from "../middlewares/authJWT"
import * as role from "../middlewares/authRole"

const router = Router();

router.get('/:projectRelation',jws.verifyToken,tasksCotroller.getTaskByProjectId);
router.get('/byWorkspace/:id',jws.verifyToken,tasksCotroller.getTaskByWorkspaceId);
router.post('/newTask',[jws.verifyToken, role.verifyRole],tasksCotroller.insertTask);
router.put('/:id',[jws.verifyToken, role.verifyRole],tasksCotroller.udpateTask);
router.delete('/:id',[jws.verifyToken, role.verifyRole],tasksCotroller.deleteTask);
router.get('/',jws.verifyToken,tasksCotroller.getTasksPending);
router.get('/data/data',tasksCotroller.Data)


export default router;
