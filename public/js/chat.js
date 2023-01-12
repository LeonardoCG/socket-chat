
const url = window.location.hostname.includes("localhost")
? "http://localhost:8080/api/auth/"
: "https://http-nodejs-production-3d7e.up.railway.app/auth/";
//"https://rest-server-v.herokuapp.com/api/auth/google";

let usuario = null;
let socket = null;

//validar jwt 
const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ) {
        //podemos redireccionar con una pagina personalizada ej
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    } );

    const { usuario: userDB,token: tokenDB } = await resp.json();
    console.log( userDB, tokenDB );
    //renovar el token en localstorage
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();

}

const conectarSocket = async() => {
    //
    const socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    });
}



const main = async() => {
    //validar jWT
    await validarJWT();
}


main();










