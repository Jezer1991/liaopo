import React from 'react';
import Button from 'react-bootstrap/Button';
import Tooltip from '@mui/material/Tooltip';
import LoginIcon from '@mui/icons-material/Login';
import {
    MDBContainer, 
    MDBCol, 
    MDBRow, 
    MDBBtn, 
    MDBInput,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody
} from 'mdb-react-ui-kit';

import Swal from 'sweetalert2'

class Prueba extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            usuario: null,
            password: null,
            basicModal: false
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.login = this.login.bind(this);
        this.toggleOpen = this.toggleOpen.bind(this);
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }
    resetearCamposLogin() {
        this.setState({
            usuario: "",
            password: ""
        })
        document.getElementById("usuario").value = ""
        document.getElementById("password").value = ""
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
                    console.log(data.result);
                    if (data.result.length <= 0) {
                        Swal.fire({
                            title: "Falló el login",
                            text: "Lo sentimos el usuario que estas intentando acceder no existe",
                            icon: "error"
                        });
                        this.resetearCamposLogin();
                    } else {
                        window.sessionStorage.setItem("usuarioLogueado", true);
                        window.sessionStorage.setItem("usuario", JSON.stringify(data.result[0]));
                        let timerInterval;
                        Swal.fire({
                            title: "Bienvenido de nuevo " + data.result[0].nombre,
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
                        }).then((result) => {
                            /* Read more about handling dismissals below */
                            if (result.dismiss === Swal.DismissReason.timer) {
                                console.log("I was closed by the timer");
                            }
                        });
                    }
                })

        },)
    }

    toggleOpen() {
        this.setState({ basicModal: !this.state.basicModal });
    }

    render() {
        return (

            <>
                <Tooltip title="Loguearse">
                    <LoginIcon onClick={this.toggleOpen} style={{ cursor: "pointer", marginLeft: "10px", color: "white" }} />
                </Tooltip>
                <MDBModal open={this.state.basicModal} tabIndex='-1'>
                    <MDBModalDialog size='xl'>
                        <MDBModalContent>
                            <MDBModalHeader>
                                <MDBModalTitle>Login</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' onClick={this.toggleOpen}></MDBBtn>
                            </MDBModalHeader>
                            <MDBModalBody>
                                <MDBContainer fluid className="p-3 my-5 h-custom">
                                    <MDBRow>
                                        <MDBCol col='10' md='6'>
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="portada" />
                                        </MDBCol>
                                        <MDBCol col='4' md='6' style={{ padding: "90px" }}>
                                            <MDBInput
                                                onChange={(e) => console.log(this.setState({ usuario: e.target.value }))}
                                                wrapperClass='mb-4'
                                                label='Email address'
                                                id='usuario'
                                                type='email'
                                                size="lg" />

                                            <MDBInput
                                                wrapperClass='mb-4'
                                                label='Password'
                                                id='password'
                                                type='password'
                                                size="lg"
                                                onChange={(e) => console.log(this.setState({ password: e.target.value }))}
                                            />
                                            <div className='text-center text-md-start mt-4 pt-2'>
                                                <Button style={{ width: "100%" }} variant="primary" onClick={this.login}>
                                                    LOGIN
                                                </Button>
                                            </div>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBContainer>
                            </MDBModalBody>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal >
            </>

        );
    }
}

export default Prueba;