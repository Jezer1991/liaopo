import React from "react";
import { Link} from '@mui/material';

import { Container, Navbar, Nav} from 'react-bootstrap';
import Bichon from "./_imagenes/bichon-frise.png"
import { Link as RouterLink } from 'react-router-dom';

class NavBar extends React.Component {

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
                    <Nav>
                        <Nav.Item >
                            <Link style={{margin: "20px", color:"white"}} to="/" component={RouterLink}>Bloques</Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link style={{color:"white"}} to='/videos' component={RouterLink}>Videos</Link>
                        </Nav.Item>
                    </Nav>
                </Container>
            </Navbar>
        );
    }
}

export default NavBar;