import React from "react";

import { Card, Alert } from "react-bootstrap";
import { CircularProgress, Box, Link, Breadcrumbs, Typography, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import NoHayDatos from "./nohaydatos";
import { Link as RouterLink } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ModalResumen from "./modalResumen";
import Timer from "./timer";
import ProgressBar from 'react-bootstrap/ProgressBar';

class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            colores: ["rgb(237, 247, 237)", "rgb(229, 246, 253)", "rgb(255, 244, 229)", "rgb(253, 237, 237)"],
            test: null,
            loading: true,
            mapaTest: [],
            opcionesSeleccionadas: [],
            contCorrectas: 0,
            contIncorrectas: 0,
            totalPreguntas: 0,
            porcentaje: 0
        }
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
                                                        loading: false,
                                                    });

                                                })
                                        })
                                    return "";
                                })
                                this.setState({
                                    mapaTest: l,
                                })
                            })
                    } else {
                        this.setState({
                            mapaTest: l,
                            loading: false,
                        });
                    }
                })
        }, 1000)
    }

    formatPreguntas(mPreguntas, mOpciones) {
        var auxPreguntas = [];
        var cont = this.state.totalPreguntas;

        mPreguntas.map(pregunta => {
            if (pregunta.anulada === 0) {
                cont++;
            }
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
        this.setState({
            totalPreguntas: cont
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

    respuestaSeleccionada(numeroPregunta, numeroTest, numeroOpcion) {
        var id = `A${numeroTest}P${numeroPregunta}O${numeroOpcion}`;
        let al = document.getElementById(id);
        var p = al.parentNode;
        var incorrectas = this.state.contIncorrectas;
        var correctas = this.state.contCorrectas;

        var opcionesSeleccionadas = this.state.opcionesSeleccionadas;
        var test = this.state.mapaTest[numeroTest];
        var pregunta = test.preguntas[numeroPregunta];
        var opcionSeleccionada = pregunta.opciones[numeroOpcion];

        var opcionCorrecta = pregunta.opciones.filter(op => op.opcionCorrecta === 1)[0];
        var buscarTest = opcionesSeleccionadas.filter(t => t.test.id_test === test.id_test);

        if (buscarTest.length > 0) {
            var buscarPregunta = buscarTest[0].preguntas.filter(p => p.pregunta.id === pregunta.id);
            if (buscarPregunta.length > 0) {
                var opcionAntigua = buscarPregunta[0].opciones.opcionSeleccionada;

                if (opcionAntigua.id_opcion === opcionCorrecta.id_opcion) {
                    correctas--;
                } else {
                    incorrectas--;
                }
                if (opcionSeleccionada.id_opcion === opcionCorrecta.id_opcion) {
                    correctas++;
                } else {
                    incorrectas++;
                }
                buscarPregunta[0].opciones.opcionSeleccionada = opcionSeleccionada;
                for (var i = 0; i < p.children.length; ++i) {
                    if (p.children[i].classList.contains('alert-secondary')) {
                        p.children[i].classList.remove("alert-secondary");
                        p.children[i].classList.add("alert-primary");
                    }
                }
            } else {
                buscarTest[0].preguntas.push({
                    pregunta: pregunta,
                    opciones: { opcionSeleccionada: opcionSeleccionada, opcionCorrecta: opcionCorrecta }
                })
                if (opcionSeleccionada.id_opcion === opcionCorrecta.id_opcion) {
                    correctas++;
                } else {
                    incorrectas++;
                }
            }
        } else {
            opcionesSeleccionadas.push({
                test: test, preguntas: [{ pregunta: pregunta, opciones: { opcionSeleccionada: opcionSeleccionada, opcionCorrecta: opcionCorrecta } }]
            })
            if (opcionSeleccionada.id_opcion === opcionCorrecta.id_opcion) {
                correctas++;
            } else {
                incorrectas++;
            }
        }
        al.classList.remove("alert-primary");
        al.classList.add("alert-secondary");
        var porcentajeActual = ((correctas+incorrectas) * 100) / this.state.totalPreguntas;

        this.setState({
            porcentaje: Math.round(porcentajeActual),
            opcionesSeleccionadas: opcionesSeleccionadas,
            contCorrectas: correctas,
            contIncorrectas: incorrectas
        })
    }

    pintarPreguntas(pregunta, i, tipoAcordion) {
        return (
            <Accordion defaultExpanded key={i} id={i} style={{ borderRadius: "10px", color: "rgb(1, 67, 97)", fontWeight: "400", marginBottom: "5px" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header" > {pregunta.nombre}</AccordionSummary>
                <AccordionDetails>
                    {
                        pregunta.opciones.map((opcion, e) => {
                            return (
                                pregunta.anulada === 0 ?
                                    <Alert style={{ cursor: "pointer" }} onClick={() => this.respuestaSeleccionada(i, tipoAcordion, e)} key={e} id={`A${tipoAcordion}P${i}O${e}`}>{opcion.opcion}</Alert>
                                    : <Alert key={e} id={`P${i}O${e}`}>{opcion.opcion}</Alert>
                            )
                        })
                    }
                </AccordionDetails>
            </Accordion>
        )
    }

    pintarSupuesto(supuesto, i) {
        return (
            <Accordion key={`supuesto${i}`} defaultExpanded style={{ background: "rgb(229, 246, 253)", color: "rgb(1, 67, 97)", fontWeight: "400" }}>
                <Paper key={`sp${i}`} elevation={3} style={{ padding: "30px", display: this.state.ocultarSupuesto ? "none" : "block" }} >
                    {supuesto.split("\\n").map((p, j) => {
                        return <p key={j}>{p}</p>
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
                    <React.Fragment key={"nHayDatos"}>
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
                        <div style={{ position: 'fixed', bottom: '50px', zIndex: 1, right: 0, width: "100%", alignItems: "center" }}>
                            <ProgressBar label={`${this.state.porcentaje}%`} animated now={this.state.porcentaje} style={{ width: "50%", margin: "0px auto" }} />
                        </div>
                        <Timer />

                        {this.state.mapaTest.map((test, i) => {
                            if (test.preguntas.length > 0) {
                                return (
                                    <Accordion TransitionProps={{ timeout: 1 }} key={i} id={i} defaultExpanded style={{ color: "#666666", background: this.state.colores[Math.floor(Math.random() * this.state.colores.length)], fontWeight: "700" }} >
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
                                )
                            } else {
                                return "";
                            }
                        })}
                        <ModalResumen
                            resumen={this.state.opcionesSeleccionadas}
                            correctas={this.state.contCorrectas}
                            incorrectas={this.state.contIncorrectas}>
                        </ModalResumen>
                    </Box>
        );
    }
}

export default Test;