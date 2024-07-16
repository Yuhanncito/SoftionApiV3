import Workspace from "../models/workSpace.model"
import jwt from "jsonwebtoken"
import { getUserId } from "./authJWT";

export const verifyRole = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        const id = await getUserId(token);
        
        if (!id) return res.status(404).json({ message: "User not found" });


        const { workspaceid } = req.body;

        
        if (!workspaceid) return res.status(400).json({ message: "Workspace ID is required" });

        const workspace = await Workspace.findById(workspaceid);
        
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        if (workspace.propetaryUser.toString() !== id._id.toString()) {
            console.log("usuarios Exactos");
            return res.status(400).json({ message: "User is not authorized for this workspace" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error role" });
    }
}