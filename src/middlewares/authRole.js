import Workspace from "../models/workSpace.model"
import jwt from "jsonwebtoken"
import { getUserId } from "./authJWT";
import privilegesModel from "../models/privileges.model";

export const verifyRole = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        if (!token) return res.status(403).json({ message: "No token provided" });

        const id = await getUserId(token);
        
        if (!id) return res.status(404).json({ message: "User not found" });


        const { workspaceid } = req.body;

        
        if (!workspaceid) return res.status(400).json({ message: "Workspace ID is required" });

        const workspace = await Workspace.findById(workspaceid);
        
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        if (workspace.propetaryUser.toString() === id._id.toString()) {
            // El usuario es el propietario del workspace, puede continuar
        } else {
            const participate = workspace.participates.find(p => p.user.toString() === id._id.toString());
            if (!participate) {
                return res.status(400).json({ message: "El usuario no es participante de este workspace" });
            }
            const privilegesName = await privilegesModel.findById(participate.privileges);
            switch (privilegesName.name) {
                case 'lectura':
                    return res.status(400).json({ message: "El usuario solo tiene privilegios de lectura en este workspace" });
                case 'lectura y escritura':
                    break;
                default:
                    return res.status(400).json({ message: "El usuario no tiene los privilegios adecuados para este workspace" });
            }
        }
        
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error role" });
    }
}