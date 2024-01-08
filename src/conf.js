
export const local = "http://localhost/";
export const HOST = "https://69b95ef0e040.ngrok.app/api/";
export const API = "http://kairosaccesorios.ddns.net:3001/api/";
//export const API = "http://localhost:3001/api/";
export const API_LOCAL = "http://localhost:3001/api/";
//export const URL_PRO = "http://localhost/"
export const URL_PRO = "http://kairosaccesorios.ddns.net/"
export let ADD = window.location.hostname === 'localhost'? true: false;
export let DELETE = window.location.hostname === 'localhost'? true: false;

export const permisos ={
    add: true,
    delete: true,
    edit: true
}
