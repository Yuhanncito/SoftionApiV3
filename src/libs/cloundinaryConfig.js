import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
    cloud_name: 'dhuutno2p', 
    api_key: '425469662671216', 
    api_secret: 'm7ySBxjVU9stFQ1hu8ygxQjxZ5w' 
});
/**
 * Esta funcion sube una imagen a cloudinary y retorna una promesa que resuelve
 * con el resultado de la subida, que es un objeto con la siguiente estructura:
 * {
 *   public_id: string,
 *   version: string,
 *   signature: string,
 *   width: number,
 *   height: number,
 *   format: string,
 *   resource_type: string,
 *   created_at: string,
 *   bytes: number,
 *   type: string,
 *   url: string,
 *   secure_url: string
 * }
 * La promesa se rechaza si ocurre un error en la subida.
 * @param {string} file - archivo a subir
 * @return {Promise} promesa que resuelve con el resultado de la subida
/**
 * Esta funcion sube una imagen a cloudinary y retorna una promesa que resuelve
 * con el resultado de la subida, que es un objeto con la siguiente estructura:
 * {
 *   public_id: string,
 *   version: string,
 *   signature: string,
 *   width: number,
 *   height: number,
 *   format: string,
 *   resource_type: string,
 *   created_at: string,
 *   bytes: number,
 *   type: string,
 *   url: string,
 *   secure_url: string
 * }
 * La promesa se rechaza si ocurre un error en la subida.
 * @param {string} file - archivo a subir
 * @return {Promise} promesa que resuelve con el resultado de la subida
 */
export const uploadImage = async (file) => {
    try {
        let response = {}
        const uploadResult = await cloudinary.uploader
            .upload(file, {
                public_id: `photo_${Date.now()}`,
            })
            .then((result) => {
                response = {
                    success: true,
                    public_id: result.public_id,
                }
            })
            .catch((error) => {
                response = {
                    success: false
                }
            })
            return response
    } catch (error) {
        return {
            success: false
        };
    }
};

