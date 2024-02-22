import React from "react";

import { Alert, Link, TextField, Button, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink } from 'react-router-dom';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

import Swal from 'sweetalert2'
import axios from 'axios';


class AddPregunta extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anhos: [],
            anhoSeleccionado: "",
            test: "",
            id_test: window.location.pathname.split("/")[3],
            preguntas: []
        }
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillMount() {
        setTimeout(() => {
            fetch(`${process.env.REACT_APP_API}anhos`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        anhos: data.result
                    });
                })

            fetch(`${process.env.REACT_APP_API}test/${this.state.id_test}`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        test: data.result[0]
                    });
                })

            fetch(`${process.env.REACT_APP_API}preguntas/${this.state.id_test}`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        preguntas: data.result
                    });
                })
        });
    }

    delete(e, id) {

        Swal.fire({
            title: 'Deseas eliminar la pregunta del test?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Borrar!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${process.env.REACT_APP_API}delete/pregunta/${id}`)
                    .then(data => {
                        if (data.status === 200) {
                            Swal.fire({
                                title: 'Borrado',
                                text: 'La pregunta se ha eliminado',
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
        this.setState({
            anhoSeleccionado: e.target.value
        })
    }
    render() {

        return (
            <React.Fragment>
                <Alert severity="success" style={{ width: "50%", margin: "0px auto" }} className="mt-5">
                    Se esta añadiendo una pregunta al test
                    <br /><strong>
                        <Link to={`/add/test/${this.state.test.id_bloque}`} color="success" underline="hover" component={RouterLink}>
                            {` ${this.state.test.nombre_test}`}
                        </Link>
                    </strong>
                </Alert>
                <form action={`${process.env.REACT_APP_API}save/pregunta`} method="post">
                    <input id="id_test" name="id_test" type="hidden" value={this.state.id_test} />
                    <input id="prevPage" name="prevPage" type="hidden" value={window.location.href} />
                    <div style={{ width: "30%", margin: "0px auto", textAlign: "center" }} className="mt-5 row">
                        <TextField
                            required
                            id="nombre"
                            name="nombre"
                            maxRows={3}
                            label="Pregunta"
                        />
                        <TextField
                        className="mt-5"
                            type="number"
                            required
                            id="orden"
                            name="orden"
                            maxRows={3}
                            label="Orden"
                        />
                        <FormControl fullWidth className="mt-5">
                            <InputLabel id="label-anho">Año</InputLabel>
                            <Select
                                labelId="label-anho"
                                value={this.state.anhoSeleccionado}
                                onChange={this.handleChange}
                                name="anho"
                                id="anho"
                                input={<OutlinedInput label="Name" />}
                            >
                                {this.state.anhos.map((anho) => (
                                    <MenuItem key={anho.id} value={anho.id}>{anho.anho}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth className="mt-5">
                            <InputLabel id="label-anho">¿Es Reserva?</InputLabel>
                            <Select
                                labelId="label-anho"
                                name="esReserva"
                                id="esReserva"
                                input={<OutlinedInput label="Name" />}
                            >
                                <MenuItem key={1} value={1}>Si</MenuItem>
                                <MenuItem key={0} value={0}>No</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth className="mt-5">
                            <InputLabel id="label-anho">¿Es pregunta anulada?</InputLabel>
                            <Select
                                labelId="label-anho"
                                name="anulada"
                                id="anulada"
                                input={<OutlinedInput label="Name" />}
                            >
                                <MenuItem key={1} value={1}>Si</MenuItem>
                                <MenuItem key={0} value={0}>No</MenuItem>
                            </Select>
                        </FormControl>

                        <Button className="mt-5" type="submit" variant="contained">Add</Button>
                    </div>
                </form >
                <div style={{ width: "80%", margin: "0px auto", textAlign: "center" }} className="mt-5 mb-5 row">
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">ID</TableCell>
                                    <TableCell align="left">Nombre</TableCell>
                                    <TableCell align="left">Año</TableCell>
                                    <TableCell align="left" colSpan={2}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.preguntas.map((pregunta) => (
                                    <TableRow
                                        key={pregunta.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left">{pregunta.id}</TableCell>
                                        <TableCell align="left">
                                            <Link to={`/add/opcion/${pregunta.id}`} color="success" underline="hover" component={RouterLink}>
                                                {pregunta.nombre}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="left">{pregunta.annho}</TableCell>
                                        <TableCell align="left">
                                            <IconButton aria-label="delete" color="error" onClick={(e) => { this.delete(e, pregunta.id) }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Link to={`/add/opcion/${pregunta.id}`} color="success" underline="hover" component={RouterLink}>
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

export default AddPregunta;