import React from "react";

import { Alert, CircularProgress, Box, Link, Button, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink } from 'react-router-dom';

import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Swal from 'sweetalert2'
import axios from 'axios';
import { TextareaAutosize } from '@mui/base';


class AddTest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bloques: [],
            tiposTest: [],
            tests: [],
            bloqueSeleccionado: "",
            tipoTestSeleccionado: "",
            id_bloque: window.location.pathname.split("/")[3],
            nombre_bloque: "",
            loading: true,
            temasE: [],
            temaSeleccionado: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTipoTest = this.handleChangeTipoTest.bind(this);
        this.handleChangeTema = this.handleChangeTema.bind(this);
    }

    componentWillMount() {

        setTimeout(() => {
            fetch(`${process.env.REACT_APP_API}allBloques`)
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

            if (this.state.id_bloque === undefined) {
                fetch(`${process.env.REACT_APP_API}tests`)
                    .then(data => {
                        return data.json();
                    }).then(data => {
                        this.setState({
                            tests: data.result,
                            loading: false,
                        });
                    })
            } else {
                fetch(`${process.env.REACT_APP_API}tests/${this.state.id_bloque}`)
                    .then(data => {
                        return data.json();
                    }).then(data => {
                        this.setState({
                            tests: data.result,
                        });
                    })

                fetch(`${process.env.REACT_APP_API}bloque/${this.state.id_bloque}`)
                    .then(data => {
                        return data.json();
                    }).then(data => {
                        this.setState({
                            nombre_bloque: data.result[0].nombre,
                            loading: false,
                        });
                    })
            }

        }, 500);
    }

    delete(e, id) {

        Swal.fire({
            title: 'Deseas eliminar el Test?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Borrar!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${process.env.REACT_APP_API}delete/test/${id}`)
                    .then(data => {
                        if (data.status === 200) {
                            Swal.fire({
                                title: 'Borrado',
                                text: 'El bloque fue borrado',
                                icon: 'success',
                                timer: 1500,
                                showConfirmButton: false,
                                timerProgressBar: true,
                                willClose: () => {
                                    window.location.reload();
                                }
                            })
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Hubo algun error con el servidor',
                            })
                        }
                    });
            }
        })
    }

    handleChange(e) {
        setTimeout(() => {
            fetch(`${process.env.REACT_APP_API}tema/${e.target.value}`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    console.log(data.result);
                    this.setState({
                        bloqueSeleccionado: e.target.value,
                        temasE: data.result,
                    });
                })
        }, 500);
    }

    handleChangeTipoTest(e) {
        this.setState({
            tipoTestSeleccionado: e.target.value
        })
    }
    handleChangeTema(e) {
        this.setState({
            temaSeleccionado: e.target.value
        });
    }

    render() {
        return (
            this.state.loading ?
                <Box sx={{ width: '90%', alignItems: "center", textAlign: "center" }}>
                    <CircularProgress />
                </Box>
                :
                <React.Fragment>


                    {this.state.nombre_bloque !== undefined && this.state.nombre_bloque.length > 0 ?
                        <Alert severity="success" style={{ width: "50%", margin: "0px auto" }} className="mt-5">
                            Se esta añadiendo un test al
                            <br /><strong>
                                <Link to={`/add/bloque`} color="success" underline="hover" component={RouterLink}>
                                    {` ${this.state.nombre_bloque}`}
                                </Link>
                            </strong>
                        </Alert>
                        : ""
                    }

                    <form action={`${process.env.REACT_APP_API}save/test`} method="post">
                        <input id="prevPage" name="prevPage" type="hidden" value={window.location.href} />
                        <div style={{ width: "30%", margin: "0px auto", textAlign: "center" }} className="mt-5 row">

                            <TextareaAutosize
                                required
                                id="nombre"
                                name="nombre"
                                label="Nombre del Test"
                            />
                            <FormControl fullWidth className="mt-5">
                                <InputLabel id="label-bloque">Bloque</InputLabel>
                                <Select
                                    labelId="label-bloque"
                                    value={this.state.bloqueSeleccionado}
                                    onChange={this.handleChange}
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
                                    onChange={this.handleChangeTipoTest}
                                    name="tipoTest"
                                    id="tipoTest"
                                    input={<OutlinedInput label="Name" />}
                                >
                                    {this.state.tiposTest.map((tipoTest) => (
                                        <MenuItem key={tipoTest.id} value={tipoTest.id}>{tipoTest.nombre}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth className="mt-5">
                            <InputLabel id="label-bloque">Temas</InputLabel>
                            <Select
                                labelId="label-bloque"
                                value={this.state.temaSeleccionado}
                                onChange={this.handleChangeTema}
                                name="id_tema"
                                id="id_tema"
                                input={<OutlinedInput label="Name" />}
                            >

                                {
                                    this.state.temasE.length > 0 && this.state.temasE !== undefined ?
                                        this.state.temasE.map((tema) => (
                                            <MenuItem key={tema.id} value={tema.id}>{`${tema.nombre_bloque} - ${tema.nombre_corto}`}</MenuItem>
                                        ))
                                        : <MenuItem >No hay temas para este bloque</MenuItem>
                                }
                            </Select>
                        </FormControl>
                            <Button className="mt-5" type="submit" variant="contained">Add</Button>
                        </div>
                    </form>
                    <div style={{ width: "80%", margin: "0px auto", textAlign: "center" }} className="mt-5 mb-5 row">
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">ID</TableCell>
                                        <TableCell align="center">Nombre</TableCell>
                                        <TableCell align="center">ID tipo Test</TableCell>
                                        <TableCell align="center">Nombre tipo Test</TableCell>
                                        <TableCell align="center">ID Bloque</TableCell>
                                        <TableCell align="center">Nombre del Bloque</TableCell>
                                        <TableCell align="center" colSpan={2}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.tests.map((test) => (
                                        <TableRow
                                            key={test.id_test}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{test.id_test}</TableCell>
                                            <TableCell align="center">
                                                <Link to={`/add/pregunta/${test.id_test}`} color="success" underline="hover" component={RouterLink}>
                                                    {test.nombre_test}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="center">{test.id_tipo_test}</TableCell>
                                            <TableCell align="center">{test.nombre_tipo_test}</TableCell>
                                            <TableCell align="center">{test.id_bloque}</TableCell>
                                            <TableCell align="center">{test.nombre_bloque}</TableCell>
                                            <TableCell align="center">
                                                <IconButton aria-label="delete" color="error" onClick={(e) => { this.delete(e, test.id_test) }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Link to={`/add/pregunta/${test.id_test}`} color="success" underline="hover" component={RouterLink}>
                                                    <QuestionAnswerIcon />
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </React.Fragment>
        );

    }
}

export default AddTest;