import { transporter } from "../libs/emailConfig";
import Confirm from "../models/confirm.model";

export const verifyEmail = async (email, codigoSecreto) => {
  try {
    const verify = await Confirm.findOne({ email: email });

    if (verify) {
      return false;
    } else {
      const newConfirm = new Confirm({
        email: email,
        secretCode: codigoSecreto,
      });

      const savedConfirm = newConfirm.save();

      await new Promise((resolve, reject) => {
        transporter.sendMail(
          {
            from: '"Codigo de Verificación" <uchijaisuka02@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Codigo de verificacion", // plain text body
            html: `
                   
                        <html>
        <head>
          <style>
            /* Estilos globales */
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.6;
              color: #333333;
            }
            
            /* Estilos para contenedores */
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            
            /* Estilos para encabezados */
            h1, h2, h3 {
              margin-top: 0;
              margin-bottom: 20px;
            }
            
            /* Estilos para párrafos */
            p {
              margin-top: 0;
              margin-bottom: 20px;
            }
            
            /* Estilos para enlaces */
            a {
              color: #007bff;
              text-decoration: underline;
            }
            
            /* Estilos para botones */
            .btn {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
            }
            
            .warning{
              color: red;
            }
            
            /* Estilos para tarjetas */
            .card {
              background-color: #f8f9fa;
              border-radius: 15px;
              padding: 20px;
              margin-bottom: 20px;
            }

            /* Estilos para imágenes */
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <div class="container card">
            <h1>Código de verificación Softion Pro</h1>
            <p>Este código es válido unicamente para verificar su correo electrónico.</p>
            <p>Su código es: <strong>${codigoSecreto}</strong></p>
            <p class="warning" >Este código caducará en 5 minutos. En caso de que no sea usted, no se recomienda utilizarlo.</p>
          </div>
        </body>
      </html>
                   
                    `, // html body
          },
          (err, info) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              console.log(info);
              resolve(info);
            }
          }
        );
      });

      deleteCodeTime(codigoSecreto, email);
      return true;
    }
  } catch (err) {
    return false;
  }
};

const deleteCodeTime = async (code, mail) => {
  try {
    setTimeout(async () => {
      const doc = await Confirm.findOne({ email: mail });
      if (!doc) return 0;
      await Confirm.findOneAndDelete({ email: mail });
      console.log("ok borrao");
    }, 5 * 60 * 1000);
  } catch (err) {
    console.log(err);
  }
};
