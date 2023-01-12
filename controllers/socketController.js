const { comprobarJWT } = require("../helpers/generarjwt");


const socketController = async (socket) => {

    //console.log('cliente conectado', socket.id);
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    if( !usuario ) {
        return socket.disconnect();
    }

    console.log('Se conecto', usuario.nombre);

} 


module.exports = socketController;