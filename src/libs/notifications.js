import Notifications from "../models/notifications.model";
import WorkSpace from "../models/workSpace.model";
import { getWebpush } from "./web-push";

const webpush = getWebpush();

export const saveNotification = async (notification) => {
    try {

        const newNotification = new Notifications({
            registration:notification
        })

        await newNotification.save();
        
    } catch (error) {
        console.log(error);
    }
}

export const saveUserInNotification = async (notifications,user) => {
    try {

        
        const notificationJson = await JSON.parse(notifications);
        const response = await Notifications.findOneAndUpdate({registration:notificationJson},{tocken:user});
        console.log("se guardo el tocken en la notificacion", response);
        console.log('Notificaciones', notificationJson, user);

    } catch (error) {
        console.log("no se pudo guardar el tocken en la notificacion");
    }
}

export const sendNotifications = async (tocken, workSpaceId, payload) => {
    try {
        const notifications = await Notifications.findOne({tocken:tocken});
        console.log('Notificaciones Buscadas', notifications);
        if(!notifications) return false;

        let users = [];
        const workSpace = await WorkSpace.findOne({_id:workSpaceId});
        if(!workSpace) return false;

        users.push(workSpace.propetaryUser);
        if(workSpace.participates.length !== 0) users.push(workSpace.participates.map(p => p.user._id));

        console.log('Usuarios Encontrados',users);
    
        
        users.forEach(async user => {
           const notification = await Notifications.findOne({tocken:user});
           if(notification) webpush.sendNotification(notification.registration, JSON.stringify(payload));
        })

        return true;
        
    } catch (error) {
        return false;
    }
}