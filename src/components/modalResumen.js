import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Alert, Button } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

class ModalResumen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            falladas: []
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    handleClose() {
        this.setState({ show: false })
    }

    handleShow() {
        this.setState({ show: true })
    }

    mostrarCorrectas(resumen) {
        return <Tab eventKey={resumen.length + 1} key={resumen.length + 1} title="Correctas">
            {resumen.map((test, i) => {
                return <Accordion defaultExpanded key={i} style={{ borderRadius: "10px", color: "rgb(1, 67, 97)", fontWeight: "400", marginBottom: "5px" }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header" > {test.test.nombre_test}</AccordionSummary>
                    <AccordionDetails>

                        {test.preguntas.sort((s1, s2) => s1.pregunta.orden - s2.pregunta.orde).map((pregunta, e) => {
                            return pregunta.opciones.opcionSeleccionada.id_opcion === pregunta.opciones.opcionCorrecta.id_opcion ?
                                <Accordion defaultExpanded key={e} style={{ borderRadius: "10px", color: "rgb(1, 67, 97)", fontWeight: "400", marginBottom: "5px" }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header" > {pregunta.pregunta.nombre}</AccordionSummary>
                                    <AccordionDetails>
                                        <Alert style={{ background: "rgb(237, 247, 237)", borderColor: "rgb(237, 247, 237)" }}>{pregunta.opciones.opcionCorrecta.opcion}<CheckCircleOutlineIcon /></Alert>
                                    </AccordionDetails>
                                </Accordion>
                                : ""
                        })}
                    </AccordionDetails>
                </Accordion>
            })}
        </Tab>
    }

    mostrarIncorrectas(resumen) {
        return <Tab eventKey={resumen.length + 2} key={resumen.length + 2} title="Incorrectas">
            {resumen.map((test, i) => {
                return <Accordion defaultExpanded key={i} style={{ borderRadius: "10px", color: "rgb(1, 67, 97)", fontWeight: "400", marginBottom: "5px" }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header" > {test.test.nombre_test}</AccordionSummary>
                    <AccordionDetails>

                        {test.preguntas.sort((s1, s2) => s1.pregunta.orden - s2.pregunta.orde).map((pregunta, e) => {
                            return pregunta.opciones.opcionSeleccionada.id_opcion !== pregunta.opciones.opcionCorrecta.id_opcion ?
                                <Accordion defaultExpanded key={e} style={{ borderRadius: "10px", color: "rgb(1, 67, 97)", fontWeight: "400", marginBottom: "5px" }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header" > {pregunta.pregunta.nombre}</AccordionSummary>
                                    <AccordionDetails>
                                        <Alert style={{ background: "rgb(237, 247, 237)", borderColor: "rgb(237, 247, 237)" }}>{pregunta.opciones.opcionCorrecta.opcion}<CheckCircleOutlineIcon /></Alert>
                                        <Alert style={{ background: "rgb(253, 237, 237)", borderColor: "rgb(253, 237, 237)" }}>{pregunta.opciones.opcionSeleccionada.opcion}</Alert>
                                    </AccordionDetails>
                                </Accordion>
                                : ""
                        })}
                    </AccordionDetails>
                </Accordion>
            })}
        </Tab>
    }

    render() {
        var { resumen, correctas, incorrectas } = this.props;
        return (
            <React.Fragment>
                <Button className="mt-5" style={{ width: "100%" }} onClick={this.handleShow}>Finalizar</Button>

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
                                        <Badge style={{ marginLeft: "10px" }} bg="success"> {correctas} </Badge>
                                    </h5>
                                </Col>
                                <Col xs={12} md={6}>
                                    <h5 style={{ textAlign: "right" }}>
                                        Número de fallos
                                        <Badge style={{ marginLeft: "10px" }} bg="danger"> {incorrectas} </Badge>
                                    </h5>
                                </Col>
                            </Row>

                            <Row>
                                <Tabs defaultActiveKey={0} id="uncontrolled-tab-example" className="mb-3">

                                    {resumen.map((test, i) => {
                                        return (
                                            <Tab eventKey={i} key={i} title={test.test.nombre_test}>
                                                {test.preguntas.map((pregunta, e) => {
                                                    return <Accordion defaultExpanded key={e} style={{ borderRadius: "10px", color: "rgb(1, 67, 97)", fontWeight: "400", marginBottom: "5px" }}>
                                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header" > {pregunta.pregunta.nombre}</AccordionSummary>
                                                        <AccordionDetails>
                                                            {pregunta.opciones.opcionSeleccionada.id_opcion === pregunta.opciones.opcionCorrecta.id_opcion ?
                                                                <Alert style={{ background: "rgb(237, 247, 237)", borderColor: "rgb(237, 247, 237)" }}>{pregunta.opciones.opcionCorrecta.opcion}<CheckCircleOutlineIcon /></Alert>
                                                                :
                                                                <React.Fragment key={e}>
                                                                    <Alert style={{ background: "rgb(237, 247, 237)", borderColor: "rgb(237, 247, 237)" }}>{pregunta.opciones.opcionCorrecta.opcion}<CheckCircleOutlineIcon /></Alert>
                                                                    <Alert style={{ background: "rgb(253, 237, 237)", borderColor: "rgb(253, 237, 237)" }}>{pregunta.opciones.opcionSeleccionada.opcion}</Alert>
                                                                </React.Fragment>}
                                                        </AccordionDetails>
                                                    </Accordion>
                                                })}
                                            </Tab>)
                                    })}
                                    {this.mostrarTodos(resumen)}
                                    {this.mostrarCorrectas(resumen)}
                                    {this.mostrarIncorrectas(resumen)}

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
            </React.Fragment>
        );
    }
}

export default ModalResumen;