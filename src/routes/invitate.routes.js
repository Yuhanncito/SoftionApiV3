import { Router } from "express";
import * as jwt from "../middlewares/authJWT"
import * as invitate from "../controllers/invitation.controller"
import { authInvitation } from "../middlewares/authInvitation";
const router = Router();

router.post('/',[jwt.verifyToken, authInvitation],invitate.setInvitatio);
router.get('/:id',jwt.verifyToken,invitate.getInvitationsByUserId);
router.delete('/:id',jwt.verifyToken,invitate.denyInvitation);
router.put('/:id',jwt.verifyToken,invitate.acceptInvitation);


export default router;