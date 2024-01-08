import React from "react";

import { Card, Accordion, Alert } from "react-bootstrap";
import { CircularProgress, Box, Link, Breadcrumbs, Typography } from '@mui/material';
import * as conf from '../conf';

class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            test: null,
            preguntas: [],
            opciones: [],
            t: [],
            loading: true
        }
    }

    componentWillMount() {
        const id_test = window.location.pathname.split("/")[2];
        console.log(id_test);
        setTimeout(() => {

            fetch(`${conf.API_LOCAL}test/${id_test}`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        test: data.result[0]
                    });
                })

            fetch(`${conf.API_LOCAL}opciones/${id_test}`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        opciones: data.result
                    });
                })

            setTimeout(() => {
                fetch(`${conf.API_LOCAL}preguntas/${id_test}`)
                    .then(data => {
                        return data.json();
                    }).then(data => {
                        this.setState({
                            preguntas: data.result,
                            loading: false
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
        }, 500);
    }

    render() {
        return (
            this.state.loading ?
                <Box sx={{ width: '90%', alignItems: "center", textAlign: "center" }}>
                    <CircularProgress />
                </Box>
                : <Box sx={{ width: '90%' }} style={{ margin: "0px auto", marginTop: "30px", marginBottom: "10px" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/" style={{ textDecoration: "none" }}>
                            Bloques
                        </Link>
                        <Link underline="hover" color="inherit" href="/" style={{ textDecoration: "none" }}>
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
                                <Accordion.Header>{`Pregunta ${i + 1}`}</Accordion.Header>
                                <Accordion.Body>
                                    <Card className="mb-2">
                                        <Card.Header><strong className="mr-5">{`Año ${pregunta.annho}`}</strong></Card.Header>
                                        <Card.Body>{pregunta.nombre}</Card.Body>
                                    </Card>
                                    {this.state.opciones.filter(o => o.id_pregunta === pregunta.id).map((opcion, i) => (
                                        opcion.opcionCorrecta === 1
                                            ? <Alert key={i} variant="success">{opcion.opcion}</Alert>
                                            : <Alert key={i} variant="danger">{opcion.opcion}</Alert>
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