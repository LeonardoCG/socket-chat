const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generarjwt");
const { ChatMensajes } = require("../models");


const chatMensaje = new ChatMensajes();


const socketController = async(socket = new Socket(), io ) => {

    //console.log('cliente conectado', socket.id);
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    if( !usuario ) {
        return socket.disconnect();
    }
    //agregar user
    chatMensaje.conectarUsuario( usuario );
    io.emit('usuarios-activos', chatMensaje.usuariosArr);

    // limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensaje.desconectarUsuario( usuario.id );
        io.emit('usuarios-activos', chatMensaje.usuariosArr);
    });

   
    



} 


module.exports = {socketController};