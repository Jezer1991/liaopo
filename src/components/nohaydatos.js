import React from 'react';


const NoHayDatos = (props) => {
    return (
        <div style={{height: '70vh', textAlign: "center", color: "rgba(0, 0, 0, 0.55)", marginTop: 50 }}><h4>{props.message}</h4></div>
    );
}

export default NoHayDatos