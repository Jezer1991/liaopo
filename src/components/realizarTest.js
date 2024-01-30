import React from "react";

import { Card, Accordion, Alert, Button, Navbar } from "react-bootstrap";
import { CircularProgress, Box, Link, Breadcrumbs, Typography, Tooltip } from '@mui/material';
import NoHayDatos from "./nohaydatos";
import { Link as RouterLink } from 'react-router-dom';
import Swal from 'sweetalert2'
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

class RealizarTest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            test: null,
            preguntas: [],
            opciones: [],
            t: [],
            loading: true,
            respuestasSeleccionadas: [],
            show: false,
            aciertos: [],
            fallos: [],
            porcentaje: 0,
            mostrarIcono: false
        }
        this.respuestaSeleccionada = this.respuestaSeleccionada.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }
    scrollToElement() {
        window.scroll({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    };

    handleScroll() {
        var tamanoTotalYScrool = document.body.scrollHeight - (20 * document.body.scrollHeight) / 100;
        if (window.pageYOffset >= tamanoTotalYScrool) {
            this.setState({
                mostrarIcono: false
            })
        } else {
            this.setState({
                mostrarIcono: true
            })
        }
        console.log(this.state.mostrarIcono, window.pageYOffset, tamanoTotalYScrool);
    };

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)

        const id_test = window.location.pathname.split("/")[3];
        setTimeout(() => {
            fetch(`${process.env.REACT_APP_API}opciones/${id_test}`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        opciones: data.result
                    });
                })

        },)

        setTimeout(() => {
            fetch(`${process.env.REACT_APP_API}preguntas/${id_test}`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        preguntas: data.result,

                    });
                    var aux = [];
                    if (data.result !== undefined) {
                        for (var i = 0; i <= data.result.length; i++) {
                            aux.push(i)
                        }
                    }
                    this.setState({
                        t: aux
                    });
                })
        });

        setTimeout(() => {

            fetch(`${process.env.REACT_APP_API}test/${id_test}`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        test: data.result[0],
                        loading: false
                    });
                })
        },);
    }

    respuestaSeleccionada(pregunta, opcionSeleccionada) {
        var preguntaRespondida = this.state.respuestasSeleccionadas.filter(rp => rp.preguntaId === pregunta.id).length > 0;
        if (preguntaRespondida) {
            Swal.fire("Lo sentimos, ya has respondido esta pregunta");
        } else {
            var porcentajeActual = ((this.state.respuestasSeleccionadas.length + 1) * 100) / this.state.preguntas.length;
            this.setState({
                porcentaje: Math.round(porcentajeActual)
            })
            var a = this.state.aciertos;
            var f = this.state.fallos;
            var aux = this.state.respuestasSeleccionadas;

            var opcionesPregunta = this.state.opciones.filter(o => o.id_pregunta === pregunta.id);
            var respuestaCorrecta = opcionesPregunta.filter(op => op.opcionCorrecta === 1)[0];

            aux.push({
                "preguntaId": pregunta.id,
                "opcionSeleccionada": opcionSeleccionada.opcion,
                "opcionSeleccionadaId": opcionSeleccionada.id_opcion,
                "opcionCorrecta": respuestaCorrecta.opcion,
                "opcionCorrectaId": respuestaCorrecta.id_opcion,
                "pregunta": pregunta.nombre
            });

            this.setState({
                respuestasSeleccionadas: aux
            })

            let al = document.getElementById(opcionSeleccionada.id_opcion);
            if (respuestaCorrecta.id_opcion === opcionSeleccionada.id_opcion) {
                al.classList.remove("alert-primary");
                al.classList.add("alert-secondary");
                a.push(1);
                this.setState({ aciertos: a })

            } else {
                al.classList.remove("alert-primary");
                al.classList.add("alert-secondary");
                f.push(1);
                this.setState({ fallos: f })
            }
        }
    }

    handleClose() {
        this.setState({ show: false })
    }

    handleShow() {
        this.setState({ show: true })
    }

    render() {
        return (
            this.state.loading ?
                <Box sx={{ width: '90%', alignItems: "center", textAlign: "center" }}>
                    <CircularProgress />
                </Box>
                :
                this.state.preguntas === undefined || this.state.preguntas.length <= 0 ?
                    <React.Fragment>
                        <NoHayDatos message={"No hay bloques en este momento"} />
                    </React.Fragment>
                    : <Box sx={{ width: '90%' }} style={{ margin: "0px auto", marginTop: "30px", marginBottom: "10px" }}>

                        <Breadcrumbs aria-label="breadcrumb">
                            <Link underline="hover" color="inherit" to="/" component={RouterLink} style={{ textDecoration: "none" }}>
                                Bloques
                            </Link>
                            <Link underline="hover" color="inherit" to="/" component={RouterLink} style={{ textDecoration: "none" }}>
                                {this.state.test.nombre_bloque}
                            </Link>
                            <Typography color="text.primary">{this.state.test.nombre_corto_tema}</Typography>
                        </Breadcrumbs>
                        <Card className="mb-2">

                            <div style={{ position: 'fixed', bottom: '50px', zIndex: 1, right: 0, width: "100%", alignItems: "center" }}>

                                {this.state.porcentaje >= 100
                                    ? <Tooltip title="finalizar">
                                        <Button style={{ cursor: "pointer", display: this.state.mostrarIcono ? "block" : "none", margin: "0px auto" }} >
                                            <ArrowCircleDownIcon onClick={this.scrollToElement} />
                                        </Button>
                                    </Tooltip>
                                    : <ProgressBar label={`${this.state.porcentaje}%`} animated now={this.state.porcentaje} style={{ width: "50%", margin: "0px auto" }} />}
                            </div>

                            <Navbar className="bg-body-tertiary mb-5" bg="dark" data-bs-theme="dark">
                                <Container>
                                </Container>
                            </Navbar>

                            <Card.Img variant="top" height="100px" src="https://i0.wp.com/latorruana.com/wp-content/uploads/2022/09/estuche-no-puedo-tengo-opos.jpg?fit=1920%2C1920&ssl=1" style={{ objectFit: "cover" }} />
                            <Card.Body>
                                <Card.Title>{this.state.test.nombre_bloque}</Card.Title>
                                <Card.Text>
                                    {this.state.test.nombre_largo_tema}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        {this.state.preguntas.map((pregunta, i) => (

                            <Card className="p-5 m-2" key={i}>
                                <Card className="mb-2">
                                    <Card.Header><strong className="mr-5">{`Año ${pregunta.annho}`}</strong>
                                    </Card.Header>
                                    <Card.Body>{pregunta.nombre}
                                    </Card.Body>
                                </Card>
                                {this.state.opciones.filter(o => o.id_pregunta === pregunta.id).map((opcion, e) => (
                                    <React.Fragment key={e}>
                                        <Alert style={{ cursor: "pointer" }} onClick={() => this.respuestaSeleccionada(pregunta, opcion)} id={opcion.id_opcion} key={e}>{opcion.opcion}
                                        </Alert>
                                    </React.Fragment>

                                ))}
                            </Card>
                        ))}

                        {this.state.porcentaje >= 100 ? <Button ref={this.refFinalizar} className="mt-5" style={{ width: "100%" }} onClick={this.handleShow}>Finalizar</Button> : ""}

                        <Modal show={this.state.show} onHide={this.handleClose}
                            size="xl"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Resumen</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Container>
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <h5 style={{ textAlign: "right" }}>
                                                Número de aciertos
                                                <Badge style={{ marginLeft: "10px" }} bg="success"> {this.state.aciertos.length} </Badge>
                                            </h5>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <h5 style={{ textAlign: "right" }}>
                                                Número de fallos
                                                <Badge style={{ marginLeft: "10px" }} bg="danger"> {this.state.fallos.length} </Badge>
                                            </h5>
                                        </Col>
                                    </Row>

                                    <Row>


                                        <Tabs
                                            defaultActiveKey="Aciertos"
                                            id="uncontrolled-tab-example"
                                            className="mb-3"
                                        >
                                            <Tab eventKey="Aciertos" title="Aciertos">
                                                <Accordion defaultActiveKey="1">
                                                    {this.state.respuestasSeleccionadas.map((rp, e) => (
                                                        rp.opcionCorrectaId === rp.opcionSeleccionadaId
                                                            ? <Accordion.Item eventKey={e} key={e}>
                                                                <Accordion.Header >
                                                                    <p style={{ backgroundColor: "darkgrey !important" }}>{rp.pregunta}
                                                                        <CheckIcon style={{ marginLeft: "10px", marginBottom: "5px" }} color="success">add_circle</CheckIcon>
                                                                    </p>
                                                                </Accordion.Header>
                                                                <Accordion.Body>
                                                                    <div className="md-12 xs-12">
                                                                        <div style={{ border: "1px solid", borderRadius: "5px", padding: "25px", background: "#198754", color: "white", fontWeight: 600 }} >{rp.opcionCorrecta}</div>
                                                                    </div>

                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                            : ""
                                                    ))}
                                                </Accordion>
                                            </Tab>
                                            <Tab eventKey="Fallos" title="Fallos">
                                                <Accordion defaultActiveKey="0">
                                                    {this.state.respuestasSeleccionadas.map((rp, e) => (
                                                        rp.opcionCorrectaId !== rp.opcionSeleccionadaId

                                                            ? <Accordion.Item eventKey={e} key={e}>
                                                                <Accordion.Header >
                                                                    <p style={{ backgroundColor: "darkgrey !important" }}>{rp.pregunta}
                                                                        <CloseIcon style={{ marginLeft: "10px", marginBottom: "5px" }} sx={{ color: "red" }}>add_circle</CloseIcon>
                                                                    </p>
                                                                </Accordion.Header>
                                                                <Accordion.Body>
                                                                    <div className="md-12 xs-12">
                                                                        <div style={{ border: "1px solid", borderRadius: "5px", padding: "25px", background: "#dc3545", color: "white", fontWeight: 600 }} >{rp.opcionSeleccionada}</div>
                                                                    </div>

                                                                </Accordion.Body>
                                                            </Accordion.Item> : ""
                                                    ))}
                                                </Accordion>
                                            </Tab>
                                            <Tab eventKey="Todos" title="Todos">
                                                <Accordion defaultActiveKey="0">
                                                    {this.state.respuestasSeleccionadas.map((rp, e) => (
                                                        <Accordion.Item eventKey={e} key={e}>
                                                            <Accordion.Header >
                                                                <p style={{ backgroundColor: "darkgrey !important" }}>{rp.pregunta}
                                                                    {rp.opcionCorrectaId !== rp.opcionSeleccionadaId
                                                                        ? <CloseIcon style={{ marginLeft: "10px", marginBottom: "5px" }} sx={{ color: "red" }}>add_circle</CloseIcon>
                                                                        : <CheckIcon style={{ marginLeft: "10px", marginBottom: "5px" }} color="success">add_circle</CheckIcon>}
                                                                </p>
                                                            </Accordion.Header>
                                                            <Accordion.Body>
                                                                <div className="md-12 xs-12">
                                                                    <div style={{ border: "1px solid", borderRadius: "5px", padding: "25px", background: "#198754", color: "white", fontWeight: 600 }} >{rp.opcionCorrecta}</div>
                                                                    {rp.opcionCorrectaId !== rp.opcionSeleccionadaId
                                                                        ? <div style={{ border: "1px solid", borderRadius: "5px", padding: "25px", background: "#dc3545", color: "white", fontWeight: 600 }} >{rp.opcionSeleccionada}</div>
                                                                        : ""}
                                                                </div>

                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    ))}
                                                </Accordion>
                                            </Tab>
                                        </Tabs>

                                    </Row>
                                </Container>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleClose}>
                                    Close
                                </Button>
                                <Button variant="warning" onClick={() => { window.location.reload(true); }}>
                                    Volver a empezar el test
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Box>
        );
    }
}

export default RealizarTest;