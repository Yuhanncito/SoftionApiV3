import Apps from "../models/app.model";

export const saveData = async (req, res) => {
    try {
        const { url, nombre, icono } = req.body;
        const newApp = new Apps({ url, nombre, icono });
        await newApp.save();
        res.status(200).json({ message: "ok" });
    }
    catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
};