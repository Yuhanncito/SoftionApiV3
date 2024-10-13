import webpush from 'web-push';
import { KEYS } from '../config.js';

webpush.setVapidDetails('mailto:uchijaisuka02@gmail.com', KEYS.KEYPUBLIC, KEYS.KEYPRIVATE);


export default  webpush;