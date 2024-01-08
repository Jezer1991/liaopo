import React from "react";

import { Container, Navbar, Nav} from 'react-bootstrap';
import Bichon from "./_imagenes/bichon-frise.png"
class NavBar extends React.Component {

    render() {
        return (
            <Navbar className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
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
                    <Nav>
                        <Nav.Item>
                            <Nav.Link href="/">Bloques</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link to='/videos'>Videos</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Container>
            </Navbar>
        );
    }
}

export default NavBar;