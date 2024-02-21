import React from 'react';
import { Box,CircularProgress,TextField, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import { Button } from 'react-bootstrap';

class Prueba extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bloques: [],
            tiposTest: [],
            bloqueSeleccionado: "",
            tipoTestSeleccionado: "",
            nombreTemaCorto: "",
            nombreTemaLargo: "",
            loading: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleBloque = this.handleBloque.bind(this);
        this.handleTipoTest = this.handleTipoTest.bind(this);
        this.handleNombreTemaCorto = this.handleNombreTemaCorto.bind(this);
        this.handleNombreTemaLargo = this.handleNombreTemaLargo.bind(this);

    }

    componentWillMount() {
        setTimeout(() => {
            fetch(`${process.env.REACT_APP_API}bloques`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        bloques: data.result,
                    });
                })

            fetch(`${process.env.REACT_APP_API}tipoTest`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        tiposTest: data.result
                    });
                })
        })
    }

    handleBloque(e) {
        this.setState({
            bloqueSeleccionado: e.target.value,
        });
    }

    handleTipoTest(e) {
        this.setState({
            tipoTestSeleccionado: e.target.value,
        });
    }

    handleNombreTemaCorto(e) {
        this.setState({
            nombreTemaCorto: e.target.value,
        });
    }

    handleNombreTemaLargo(e) {
        this.setState({
            nombreTemaLargo: e.target.value,
        });
    }

    handleChange(e) {
        this.setState({
            loading: true
        })
        if (this.state.bloqueSeleccionado !== null && this.state.bloqueSeleccionado !== "") {
            var test = document.getElementById("texto").value;
            var a1 = test.split("//////");

            var bloque = this.state.bloqueSeleccionado;
            var tema = this.state.nombreTemaCorto;
            var nombreTema = this.state.nombreTemaLargo;
            var tipoTest = this.state.tipoTestSeleccionado;

            console.log("Bloque seleccionado ", bloque);
            console.log("Nombre Tema corto ", tema);
            console.log("Nombre Tema largo ", nombreTema);
            console.log("Tipo test seleccionado ", tipoTest);

            const requestOptionsTema = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre_corto: tema,
                    nombre_largo: nombreTema,
                    id_bloque: bloque
                })
            };


            setTimeout(() => {
                fetch(`${process.env.REACT_APP_API}save/tema2`, requestOptionsTema)
                    .then(data => {
                        return data.json();
                    }).then(data => {
                        var id = data.result.insertId;
                        console.log("Se ha insertado el tema", id);

                        const requestOptionsTest = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                nombre: nombreTema,
                                id_bloque: +bloque,
                                id_tipo_test: tipoTest,
                                id_tema: id
                            })
                        };

                        fetch(`${process.env.REACT_APP_API}save/test2`, requestOptionsTest)
                            .then(data => {
                                return data.json();
                            }).then(data => {
                                var idTest = data.result.insertId;
                                console.log("Se ha insertado el test", idTest);

                                a1.map((t, e) => {
                                    var aux = t.substr(test.indexOf("d)"));
                                    console.log(aux);
                                    var le = t.substr(aux.indexOf("d)"), aux.indexOf(".") + 1);
                                    var start = t.indexOf("Examen");
                                    var final = t.indexOf("d)") + le.length;
                                    var respuesCorrecta = t.indexOf("Respuesta correcta: ");
                                    if (respuesCorrecta !== -1) {
                                        final = respuesCorrecta + "Respuesta correcta: ".length + 2;
                                    }
                                    var separacionTest = t.substr(start, final);

                                    var sinEspacios = separacionTest.trim().replaceAll("\n", "<br>")
                                    var partes = sinEspacios.split("<br>");
                                    partes = partes.filter(element => element.length > 0);
                                    console.log(partes);
                                    var anho = sinEspacios.substr(0, sinEspacios.indexOf("<br>"));
                                    sinEspacios = sinEspacios.substr(anho.length + 4);
                                    console.log(partes);
                                    const requestOptionsAnho = {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            anho: partes[0].substr(partes[0].length - 4, partes[0].length)
                                        })
                                    };

                                    fetch(`${process.env.REACT_APP_API}anho`, requestOptionsAnho)
                                        .then(data => {
                                            return data.json();
                                        }).then(data => {
                                            var idAnho = data.result[0].id
                                            console.log("Año recuperado", idAnho);

                                            const requestOptionsPregunta = {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    nombre: (e + 1) + ". " + partes[1],
                                                    id_test: idTest,
                                                    anho: idAnho,
                                                    orden: (e + 1)
                                                })
                                            }
                                            fetch(`${process.env.REACT_APP_API}save/pregunta2`, requestOptionsPregunta)
                                                .then(data => {
                                                    return data.json();
                                                }).then(data => {
                                                    console.log("data => ", data);
                                                    var idPregunta = data.result.insertId
                                                    console.log("Se ha insertado la pregunta", idPregunta);
                                                    var respuestaCorrecta = partes[partes.length - 1];
                                                    if (respuestaCorrecta.includes("Respuesta correcta")) {
                                                        respuestaCorrecta = respuestaCorrecta.substr(respuestaCorrecta.length - 2, respuestaCorrecta.length - 1).replaceAll(")", "").trim();
                                                    }
                                                    var init = partes.length > 7 ? 3 : 2;

                                                    for (var aux = init; aux <= partes.length - 2; aux++) {
                                                        var actualOpcion = partes[aux].substr(0, 1);
                                                        const requestOptionsOpcion = {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                opcion: partes[aux],
                                                                id_pregunta: +idPregunta,
                                                                opcionCorrecta: actualOpcion.trim() === respuestaCorrecta.trim() ? 1 : 0,
                                                            })
                                                        }

                                                        fetch(`${process.env.REACT_APP_API}save/opcion2`, requestOptionsOpcion)
                                                            .then(data => {
                                                                return data.json();
                                                            }).then(data => {
                                                                var idOpcion = data.result.insertId;
                                                                console.log("Se ha insertado la opcion ", idOpcion);
                                                            });
                                                    }
                                                    this.setState({
                                                        loading: false
                                                    })
                                                })
                                        })


                                    return null;
                                })
                            })
                    })
            })
        }
    }

    render() {
        return (
            this.state.loading ?
            <Box sx={{ width: '90%', alignItems: "center", textAlign: "center" }}>
                <CircularProgress />
            </Box>:
            <div style={{ margin: "10px", paddingBottom: "60px" }}>
                <TextField fullWidth
                    className="mt-5"
                    required
                    id="nombre_tema_corto"
                    name="nombre_tema_corto"
                    label="Nombre Tema corto"
                    onChange={this.handleNombreTemaCorto}
                />
                <TextField fullWidth
                    className="mt-5"
                    required
                    id="nombre_tema_largo"
                    name="nombre_tema_largo"
                    label="Nombre Tema largo"
                    onChange={this.handleNombreTemaLargo}
                />
                <FormControl fullWidth className="mt-5">
                    <InputLabel id="label-bloque">Bloque</InputLabel>
                    <Select
                        labelId="label-bloque"
                        value={this.state.bloqueSeleccionado}
                        onChange={this.handleBloque}
                        name="bloque"
                        id="bloque"
                        input={<OutlinedInput label="Name" />}
                    >
                        {this.state.bloques.map((bloque) => (
                            <MenuItem key={bloque.id} value={bloque.id}>{bloque.nombre}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth className="mt-5">
                    <InputLabel id="label-tipoTest">Tipo Test</InputLabel>
                    <Select
                        labelId="label-tipoTest"
                        value={this.state.tipoTestSeleccionado}
                        onChange={this.handleTipoTest}
                        name="tipoTest"
                        id="tipoTest"
                        input={<OutlinedInput label="Name" />}
                    >
                        {this.state.tiposTest.map((tipoTest) => (
                            <MenuItem key={tipoTest.id} value={tipoTest.id}>{tipoTest.nombre}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <textarea rows={20} className="col-sm-12" id="texto" type="text"></textarea>
                <Button onClick={this.handleChange}>Guardar</Button>
            </div>
        )
    }
}

export default Prueba;