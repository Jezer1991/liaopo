import React from "react";

function ErrorPage(props) {
    return <div style={{minHeight:"500px", margin: '0px auto', textAlign:'center'}}><h1>{props.nombre != null? props.nombre : 'Error'}</h1></div>;
}
export default ErrorPage;