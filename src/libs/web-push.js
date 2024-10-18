import webpush from 'web-push';

const setUp = () => {
  
  const mail = process.env.MAILUSER;
  const KEYPUBLIC = process.env.KEYPUBLIC;
  const KEYPRIVATE = process.env.KEYPRIVATE;

  webpush.setVapidDetails('mailto:' + mail, KEYPUBLIC, KEYPRIVATE);
  console.log('Configuración de VAPID establecida correctamente.');

  return webpush;
}

export const getWebpush = () =>{
    return webpush;
};


export default setUp;

export const sendNotification = (users, title, message) =>{
    if (!users || !title || !message) return;

    const payload = JSON.stringify({title:title, message:message});

    users.forEach(user => {
        webpush.sendNotification(users.registration, payload);
    })
}
