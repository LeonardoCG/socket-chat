const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionValida = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombrecortado = archivo.name.split('.');
        const extension = nombrecortado[nombrecortado.length - 1];

        // validar la extension
        if (!extensionValida.includes(extension)) {
            return reject( `La extension ${extension} no es permitida - ${extensionValida}`);
        }

        const nombreTemp = uuidv4() + '.' + extension; // crea el nombre del archivo
        const uploadPath = path.join(__dirname, '../uploads', carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve( nombreTemp );
        });
    });
}

module.exports = {
    subirArchivo
}