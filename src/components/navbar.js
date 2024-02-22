import React from "react";

import { Container, Navbar, Nav } from 'react-bootstrap';
import Bichon from "./_imagenes/bichon-frise.png"
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Login from "./login";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }


    logout() {
        window.sessionStorage.setItem("usuarioLogueado", false);
        window.location.reload(true);
    }
    render() {
        return (

            <Navbar className="bg-body-tertiary mb-5" bg="dark" data-bs-theme="dark">
                <Container>
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
                    <Nav className="me-auto mt-5">
                        <Nav.Link href="/">Bloques</Nav.Link>
                        <Nav.Link href="/examenes">Examenes</Nav.Link>
                    </Nav>
                    {window.sessionStorage.getItem("usuarioLogueado") === "true" ?
                        <Dropdown align="end" as={ButtonGroup} className="mt-5">
                            <Dropdown.Toggle style={{ background: "inherit", border: "0px" }}>
                                <SettingsIcon />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <p style={{ padding: "10px" }}>Hola {JSON.parse(window.sessionStorage.getItem("usuario")).nombre_usuario}</p>
                                <Dropdown.Divider />
                                {JSON.parse(window.sessionStorage.getItem("canList"))
                                    ? <Dropdown.Item href="/add/bloque">Bloques</Dropdown.Item>
                                    : ""
                                }
                                {JSON.parse(window.sessionStorage.getItem("canList"))
                                    ? <Dropdown.Item href="/add/bloque">Bloques</Dropdown.Item>
                                    : ""
                                }
                                <Dropdown.Item href="/add/test">Tests</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="4" onClick={this.logout}><LogoutIcon /></Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        : <Navbar.Collapse className="justify-content-end  mt-5">
                            <Login />
                        </Navbar.Collapse>
                    }

                </Container>
            </Navbar>
        );
    }
}

export default NavBar;