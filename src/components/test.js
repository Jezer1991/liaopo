import React from "react";

import { Card, Alert, Button } from "react-bootstrap";
import { CircularProgress, Box, Link, Breadcrumbs, Typography, Tooltip, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NoHayDatos from "./nohaydatos";
import { Link as RouterLink } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            colores:["rgb(237, 247, 237)","rgb(229, 246, 253)","rgb(255, 244, 229)","rgb(253, 237, 237)"],
            test: null,
            loading: true,
            mapaTest: []
        }
        this.mostrarRespuesta = this.mostrarRespuesta.bind(this);
    }

    componentWillMount() {

        const id_test = window.location.pathname.split("/")[3];
        setTimeout(() => {
            var l = [];
            var mPreguntas = [];
            var mOpciones = [];
            fetch(`${process.env.REACT_APP_API}test/${id_test}`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    var test = data.result[0];
                    fetch(`${process.env.REACT_APP_API}preguntas/${id_test}`)
                        .then(data => {
                            return data.json();
                        }).then(data => {
                            mPreguntas = data.result;
                            fetch(`${process.env.REACT_APP_API}opciones/${id_test}`)
                                .then(data => {
                                    return data.json();
                                }).then(data => {
                                    mOpciones = data.result;
                                    l.push({
                                        id_test: +id_test,
                                        preguntas: this.formatPreguntas(mPreguntas, mOpciones),
                                        nombre_test: test.nombre,
                                        tieneSupuesto: test.tieneSupuesto,
                                        supuesto: test.supuesto,
                                        orden: 0
                                    })
                                    this.setState({
                                        test: test,
                                    });
                                })
                        })
                    if (data.result[0].tieneSubtemas) {
                        fetch(`${process.env.REACT_APP_API}compuestos/${data.result[0].id_tema}`)
                            .then(data => {
                                return data.json();
                            }).then(data => {
                                var totalSubtemas = data.result;

                                totalSubtemas.map((compuesto, i) => {
                                    var mPreguntas = [];
                                    var mOpciones = [];
                                    fetch(`${process.env.REACT_APP_API}opciones/${compuesto.id_hijo}`)
                                        .then(data => {
                                            return data.json();
                                        }).then(data => {
                                            mOpciones = data.result;

                                            fetch(`${process.env.REACT_APP_API}preguntas/${compuesto.id_hijo}`)
                                                .then(data => {
                                                    return data.json();
                                                }).then(data => {
                                                    mPreguntas = data.result;
                                                    mPreguntas = data.result;
                                                    this.crearMapaTest(compuesto, mPreguntas, mOpciones, l);
                                                    this.setState({
                                                        loading: false
                                                    });

                                                })
                                        })
                                    return "";
                                })
                                this.setState({
                                    mapaTest: l
                                })
                            })
                    } else {
                        this.setState({
                            mapaTest: l,
                            loading: false
                        });
                    }
                })
        }, 1000)
    }


    formatPreguntas(mPreguntas, mOpciones) {
        var auxPreguntas = [];
        mPreguntas.map(pregunta => {
            return auxPreguntas.push({
                anho: pregunta.anho,
                annho: pregunta.annho,
                anulada: pregunta.anulada,
                esReserva: pregunta.esReserva,
                id: pregunta.id,
                id_test: pregunta.id_test,
                nombre: pregunta.nombre,
                opciones: mOpciones.filter(opcion => opcion.id_pregunta === pregunta.id)

            })
        })
        return auxPreguntas;
    }

    crearMapaTest(compuesto, mPreguntas, mOpciones, aux) {
        aux.push({
            id_test: compuesto.id_hijo,
            preguntas: this.formatPreguntas(mPreguntas, mOpciones),
            nombre_test: compuesto.Nombre,
            supuesto: compuesto.supuesto,
            orden: compuesto.orden
        });
        return aux.sort((a, b) => a.orden - b.orden)
    }
    mostrarRespuesta(a) {
        console.log(a);
        let al = document.getElementById(a)
        if (al.style.display === "none") {
            al.style.display = "inline";
        } else {
            al.style.display = "none";
        }
    }


    pintarPreguntas(pregunta, i, tipoAcordion) {
        console.log(tipoAcordion);
        return (
            <Accordion defaultExpanded key={i} id={i} style={{ borderRadius: "10px", color: "rgb(1, 67, 97)", fontWeight: "400", marginBottom: "5px" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header" > {pregunta.nombre}</AccordionSummary>
                {pregunta.anulada === 0 ?
                    <Tooltip title="Ver la respuesta correcta" >
                        <Button style={{ marginLeft: "18px", background: "rgb(255, 244, 229)", borderColor: "rgb(255, 244, 229)", color: "rgb(102, 60, 0)" }}
                            onClick={(e) => { this.mostrarRespuesta(`c${tipoAcordion}${i}`) }}>
                            <TipsAndUpdatesIcon />
                        </Button>
                    </Tooltip> : ""
                }
                <AccordionDetails>
                    {
                        pregunta.opciones.map((opcion, e) => {
                            return this.pintarOpciones(opcion, i, tipoAcordion, e)
                        })
                    }
                </AccordionDetails>
            </Accordion>
        )
    }

    pintarOpciones(opcion, i, tipoAcordion, e) {
        return (
            opcion.opcionCorrecta === 1
                ? <Alert key={e}>{opcion.opcion} <CheckCircleOutlineIcon id={`c${tipoAcordion}${i}`} style={{ display: "none" }} /></Alert>
                : <Alert key={e}>{opcion.opcion}</Alert>
        )
    }

    pintarSupuesto(supuesto, i) {
        return (
            <Accordion key={`supuesto${i}`} defaultExpanded style={{ background: "rgb(229, 246, 253)", borderRadius: "10px", color: "rgb(1, 67, 97)", fontWeight: "400", marginBottom: "10px" }}>
                    <Paper elevation={3} style={{ padding: "30px", display: this.state.ocultarSupuesto ? "none" : "block" }} >
                        {supuesto.split("\\n").map(p => {
                            return <p>{p}</p>
                        })}
                    </Paper>
            </Accordion>
        )
    }
    render() {
        return (

            this.state.loading ?
                <Box sx={{ width: '90%', alignItems: "center", textAlign: "center" }}>
                    <CircularProgress />
                </Box>
                :
                this.state.mapaTest === undefined || this.state.mapaTest.length <= 0 ?
                    <React.Fragment>
                        <NoHayDatos message={"No hay bloques en este momento"} />
                    </React.Fragment>
                    : <Box sx={{ width: '90%' }} style={{ margin: "0px auto", marginTop: "30px", marginBottom: "50px" }}>
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
                            <Card.Img variant="top" height="100px"
                                src="https://i0.wp.com/latorruana.com/wp-content/uploads/2022/09/estuche-no-puedo-tengo-opos.jpg?fit=1920%2C1920&ssl=1"
                                style={{ objectFit: "cover" }} />
                            <Card.Body>
                                <Card.Title>{this.state.test.nombre_bloque}</Card.Title>
                                <Card.Text>
                                    {this.state.test.nombre_largo_tema}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        {this.state.mapaTest.map((test, i) => {
                            if (test.preguntas.length > 0) {
                                return (
                                    <React.Fragment>

                                        <Accordion TransitionProps={{ timeout: 1 }} key={i} id={i} defaultExpanded  style={{ color: "#666666",borderRadius: "10px", background: this.state.colores[ Math.floor(Math.random() * this.state.colores.length)], fontWeight: "700", marginBottom: "5px"}} >
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header" > {test.nombre_test}</AccordionSummary>
                                            <AccordionDetails>
                                                {test.supuesto !== null ? this.pintarSupuesto(test.supuesto) : ""}
                                                {
                                                    test.preguntas.map((pregunta, e) => {
                                                        return this.pintarPreguntas(pregunta, e, i)
                                                    })
                                                }
                                            </AccordionDetails>
                                        </Accordion>
                                    </React.Fragment>
                                )
                            }else{
                                return"";
                            }
                        })}

                    </Box>
        );
    }
}

export default Test;