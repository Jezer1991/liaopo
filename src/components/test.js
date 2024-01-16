import React from "react";

import { Card, Accordion, Alert, Button } from "react-bootstrap";
import { CircularProgress, Box, Link, Breadcrumbs, Typography, Tooltip } from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NoHayDatos from "./nohaydatos";
import { Link as RouterLink } from 'react-router-dom';

class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            test: null,
            preguntas: [],
            opciones: [],
            t: [],
            loading: true,
        }
        this.mostrarRespuesta = this.mostrarRespuesta.bind(this);
    }

    componentDidMount() {

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
        }, );


    }
    mostrarRespuesta(a) {
        let al = document.getElementById(a)
        if (al.style.display === "none") {
            al.style.display = "inline";
        } else {
            al.style.display = "none";
        }
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
                            <Card.Img variant="top" height="100px" src="https://i0.wp.com/latorruana.com/wp-content/uploads/2022/09/estuche-no-puedo-tengo-opos.jpg?fit=1920%2C1920&ssl=1" style={{ objectFit: "cover" }} />
                            <Card.Body>
                                <Card.Title>{this.state.test.nombre_bloque}</Card.Title>
                                <Card.Text>
                                    {this.state.test.nombre_largo_tema}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Accordion defaultActiveKey={this.state.t} alwaysOpen>
                            {this.state.preguntas.map((pregunta, i) => (
                                <Accordion.Item key={i} eventKey={i}>
                                    <Accordion.Header >
                                        {`Pregunta ${i + 1}`}
                                    </Accordion.Header>

                                    <Accordion.Body>
                                        <Card className="mb-2">
                                            <Card.Header><strong className="mr-5">{`Año ${pregunta.annho}`}</strong>
                                            </Card.Header>
                                            <Card.Body>{pregunta.nombre}
                                            </Card.Body>
                                            <Button onClick={(e) => { this.mostrarRespuesta(`RP${i}`) }}>
                                                <Tooltip title="Ver la respuesta correcta" style={{ marginLeft: "10px", marginBottom: "10px" }}>
                                                    <TipsAndUpdatesIcon />
                                                </Tooltip>
                                            </Button>
                                        </Card>
                                        {this.state.opciones.filter(o => o.id_pregunta === pregunta.id).map((opcion, e) => (
                                            <React.Fragment key={e}>
                                                {opcion.opcionCorrecta === 1
                                                    ? <Alert key={e}>{opcion.opcion} <CheckCircleOutlineIcon id={`RP${i}`} style={{ display: "none" }} /></Alert>
                                                    : <Alert key={e}>{opcion.opcion}</Alert>}
                                            </React.Fragment>

                                        ))}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </Box>
        );
    }
}

export default Test;