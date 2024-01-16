import React from "react";
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';

class Acordion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tests: [],
            preguntas: [],
            opciones: [],
            value:[]
        }
        this.cargarPreguntas = this.cargarPreguntas.bind(this);
        this.cargarOpciones = this.cargarOpciones.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        setTimeout(() => {
            fetch(`${process.env.REACT_APP_API}tests`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        tests: data.result
                    });
                })
        });
    }

    cargarPreguntas(id_test) {
        setTimeout(() => {
            fetch(`${process.env.REACT_APP_API}pregunta/${id_test}`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        preguntas: data
                    });
                })
        });
    }

    cargarOpciones(id_pregunta) {
        setTimeout(() => {
            fetch(`${process.env.REACT_APP_API}opcion/${id_pregunta}`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        opciones: data
                    });
                })
        });
    }
    handleChange (val) {
        this.state.setState({value:val});
    }
    render() {
        return (
            <React.Fragment>
                <Accordion defaultActiveKey="0">
                    {this.state.tests.map((test) => (
                        <Accordion.Item onClick={(e) => { this.cargarPreguntas(test.id) }} key={`T${test.id}`} eventKey={`T${test.id}`} >
                            <Accordion.Header>{test.Nombre}</Accordion.Header>
                            <Accordion.Body>
                                <Accordion defaultActiveKey="1">
                                    {this.state.preguntas.map((pregunta, i) => (
                                        <Accordion.Item key={`P${pregunta.id}`} eventKey={`T${pregunta.id}`} >
                                            <Accordion.Header onClick={(e) => { this.cargarOpciones(pregunta.id) }}>{`Pregunta ${i + 1}`}</Accordion.Header>
                                            <Accordion.Body>

                                                <Card className="mb-2">
                                                    <Card.Header><strong className="mr-5">{`Año ${pregunta.anho}`}</strong></Card.Header>
                                                    <Card.Body>{pregunta.Nombre}</Card.Body>
                                                </Card>
                                                {this.state.opciones.map((op,i) => (
                                                    op.opcionCorrecta === 1
                                                    ?<Alert key={i} variant="success">{op.opcion}</Alert>
                                                    :<Alert key={i} variant="danger">{op.opcion}</Alert>
                                                ))}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </React.Fragment>
        )
    }
}
export default Acordion;