import mongoose from "mongoose";
import dns from 'dns';
import net from 'net';

const connectWithRetry = () => {
  mongoose.connect(process.env.DB_URL)
  .then(db => console.log('DB está conectada'))
  .catch(err => {
    console.error('Error al conectar a la DB:', err);
    dns.resolve('www.google.com', (dnsErr) => {
      if (dnsErr) {
        console.error('Problema de conectividad a internet, reintentando...');
      } else if (!net.isIP('softiondb.uy6dflb.mongodb.net')) {
        console.error('No se puede resolver el DNS de la base de datos, reintentando...');
      } else {
        console.error('Error desconocido, reintentando...');
      }
      setTimeout(connectWithRetry, 5000); // Reintenta cada 5 segundos
    });
  });
};

connectWithRetry();
