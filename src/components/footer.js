import * as React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { Typography } from '@mui/material';



class Footer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false
    }
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }
  handleClose() {
    this.setState({
      show: false
    });
  }

  handleShow() {
    this.setState({
      show: !this.state.show
    });
  }
  render() {
    return (
      <Navbar className="bg-body-tertiary" bg="dark" data-bs-theme="dark" fixed="bottom">
        <Container>
          <Navbar.Brand>
            <Typography style={{ textAlign: 'center', opacity: '0.6', color: '#c6c6c6', fontWeight: '800' }} variant="body2" color="text.secondary" align="center">
              {'Copyright ©  Opo\'Lia '}
              { new Date().getFullYear()}
              {'.'}

            </Typography>
          </Navbar.Brand>
        </Container>
      </Navbar>

    )
  }
}

export default Footer;