
const url = window.location.hostname.includes("localhost")
? "http://localhost:8080/api/auth/"
: "https://http-nodejs-production-3d7e.up.railway.app/auth/";
//"https://rest-server-v.herokuapp.com/api/auth/google";

let usuario = null;
let socket  = null;

//Referencias HTML
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensaje  = document.querySelector('#ulMensaje');
const btnSalir   = document.querySelector('#btnSalir');

//validar jwt en localstore
const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ) {
        //podemos redireccionar con una pagina personalizada ej
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
    //renovar el token en localstorage
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();

}

const conectarSocket = async() => {
    //
    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets Offline')
    });

    socket.on('recibir-mensaje', (payload) => {
        //TODO:
        console.log(payload)
    });

    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', () => {
        //TODO:
    });

}

const dibujarUsuarios = ( usuarios = []) => {

    let userHtml = '';
    usuarios.forEach( ({nombre, uid}) => {

        userHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ nombre }</h5>
                    <span class"fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = userHtml;
}
//keyup, corresponde a una tecla devolviendo un numero
txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if( keyCode !== 13 ) { return; } // si es igual lo manda
    if( mensaje.length === 0) { return; }

    socket.emit('enviar-mensaje', { mensaje, uid } );

})

const main = async() => { 
    //validar jWT
    await validarJWT();
}


main();










