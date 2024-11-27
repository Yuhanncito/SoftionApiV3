import Apps from "../models/app.model";

export const saveData = async (req, res) => {
    try {
        const { url, nombre, icono } = req.body;
        if (!url || !nombre || !icono) {
            return res.status(400).json({ message: "Campos requeridos" });
        }
        const newApp = new Apps({ url, nombre, icono });
        await newApp.save();
        res.status(200).json({ message: "ok" });
    }
    catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
};