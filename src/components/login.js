import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import LoginIcon from '@mui/icons-material/Login';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2'
import Bichon from "./_imagenes/bichon-frise.png"
import {Navbar } from 'react-bootstrap';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            usuario: null,
            password: null,
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.login = this.login.bind(this);
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }
    resetearCamposLogin(){
        this.setState({
            usuario: "",
            password: ""
        })
        document.getElementById("usuario").value=""
        document.getElementById("password").value=""
    }

    getPermisos(data){
        console.log(data.result);
        const aux = data.result.map(p => p.id_permiso);
        console.log(process.env.REACT_APP_PERMISO_ADD);
        console.log(aux.includes(process.env.REACT_APP_PERMISO_ADD));
        window.sessionStorage.setItem("canAdd", aux.includes(parseInt(process.env.REACT_APP_PERMISO_ADD)));
        window.sessionStorage.setItem("canDelete", aux.includes(parseInt(process.env.REACT_APP_PERMISO_DELETE)));
        window.sessionStorage.setItem("canEdit", aux.includes(parseInt(process.env.REACT_APP_PERMISO_EDIT)));
        window.sessionStorage.setItem("canList", aux.includes(parseInt(process.env.REACT_APP_PERMISO_LIST)));
    }

    login() {
        setTimeout(() => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario: this.state.usuario, password: this.state.password })
            };
            fetch(`${process.env.REACT_APP_API}login`, requestOptions)
                .then(data => {
                    return data.json();
                }).then(data => {
                    console.log(data);
                    if (data.result.length <= 0) {
                        Swal.fire({
                            title: "Falló el login",
                            text: "Lo sentimos el usuario que estas intentando acceder no existe",
                            icon: "error"
                        });
                        this.resetearCamposLogin();
                    } else {
                        localStorage.setItem("aux", "aux")
                        window.sessionStorage.setItem("usuarioLogueado", true);
                        window.sessionStorage.setItem("usuario", JSON.stringify({nombre_usuario: data.result[0].nombre_usuario}));
                        this.getPermisos(data);
                        let timerInterval;
                        Swal.fire({
                            title: "Bienvenido de nuevo "+data.result[0].nombre_usuario,
                            html: "La ventana se cerrara en <b></b>",
                            timer: 2000,
                            timerProgressBar: true,
                            didOpen: () => {
                                Swal.showLoading();
                                const timer = Swal.getPopup().querySelector("b");
                                timerInterval = setInterval(() => {
                                    timer.textContent = `${Swal.getTimerLeft()}`;
                                }, 100);
                            },
                            willClose: () => {
                                clearInterval(timerInterval);
                                window.location.reload(true);
                            }
                        });
                    }
                })

        },)

    }

    render() {

        return (
            <>
                <Tooltip title="Loguearse">
                    <LoginIcon onClick={this.handleShow} style={{ cursor: "pointer", marginLeft: "10px", color: "white" }} />
                </Tooltip>

                <Modal show={this.state.show} onHide={this.handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="row p-5">
                        <Navbar.Brand href="/">
                        <img
                            alt=""
                            src={Bichon}
                            width="40"
                            height="40"
                            className="d-inline-block align-top"
                        />{' '}
                        <h1>Lia'Opo</h1>
                    </Navbar.Brand>
                            <TextField
                                className="mb-4"
                                id="usuario"
                                label="Usuario"
                                type="text"
                                onChange={(e) => this.setState({ usuario: e.target.value })}
                                autoComplete="current-password"
                            />
                            <TextField
                                className="mb-4"
                                id="password"
                                label="Password"
                                type="password"
                                onChange={(e) => this.setState({ password: e.target.value })}
                                autoComplete="current-password"
                            />
                            <Button style={{ width: "100%" }} variant="primary" onClick={this.login}>
                                LOGIN
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}
export default Login;