const { response } = require("express")


const validarArchivo = ( req, res = response, next) => {

    if (!req.files || !req.files.archivo || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            msg: 'No files were uploads. - archivo'
        });
        
    }

    next();
}

module.exports = {
    validarArchivo
}