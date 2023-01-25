const { Socket } = require('socket.io');
const { comprobarJWT } = require("../helpers/generarjwt");
const  ChatMensajes  = require('../models/chat-mensajes')

const chatMensajes = new ChatMensajes();


const socketController = async(socket = new Socket(), io ) => {

    //console.log('cliente conectado', socket.id);
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    if( !usuario ) {
        return socket.disconnect();
    }
    //agregar user

    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);

    // limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        
        chatMensajes.enviarMensaje( usuario.id, usuario.nombre, mensaje );
        io.emit('recibir-mensaje', chatMensajes.ultimos10);
    });
} 


module.exports = { 
    socketController 
};