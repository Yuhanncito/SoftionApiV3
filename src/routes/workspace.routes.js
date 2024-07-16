import { Router } from "express";
import * as jws from "../middlewares/authJWT"
import * as auth from "../middlewares/authRole"
import * as WorkspaceController from "../controllers/workspace.controller"
const router = Router();

router.get('/',jws.verifyToken,WorkspaceController.getWorkspacesWithUser)
router.post('/',jws.verifyToken,WorkspaceController.newWorkspace)
router.put('/',[jws.verifyToken,auth.verifyRole],WorkspaceController.updateParticipatesRole)
router.get('/:id',jws.verifyToken,WorkspaceController.getWorkspacesWithId)

export default router;