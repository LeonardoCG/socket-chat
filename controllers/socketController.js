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
    // se conecta un nuevo socket enviar la lista de 10msj
    socket.emit('recibir-mensaje', chatMensajes.ultimos10);

    socket.join( usuario.id ); // global, socket.id, usuario.id

    // limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        
        if( uid ) {
            //mensaje privado
            socket.to( uid ).emit( 'mensaje-privado', { De: usuario.nombre, mensaje })
        } else {

            chatMensajes.enviarMensaje( usuario.id, usuario.nombre, mensaje );
            io.emit('recibir-mensaje', chatMensajes.ultimos10);
        }
    });
} 


module.exports = { 
    socketController 
};