
//export const API = "http://localhost:3001/api/";
export const API = "https://69b95ef0e040.ngrok.app/api/";
//export const URL_PRO = "http://localhost/"
export let ADD = window.location.hostname === 'localhost'? true: false;
export let DELETE = window.location.hostname === 'localhost'? true: false;

export const permisos ={
    add: true,
    delete: true,
    edit: true
}
