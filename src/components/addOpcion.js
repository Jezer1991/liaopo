import React from "react";


import { Alert,Link, TextField, Button, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink } from 'react-router-dom';

import Swal from 'sweetalert2'
import axios from 'axios';
import * as conf from '../conf';

class AddOpcion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opciones: [],
            id_pregunta: window.location.pathname.split("/")[3],
            pregunta: "",
            opcionCorrecta: 0
        }
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillMount() {
        setTimeout(() => {
            fetch(`${conf.API}opcion/${this.state.id_pregunta}`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        opciones: data
                    });
                })
            fetch(`${conf.API}pregunta/${this.state.id_pregunta}`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        pregunta: data.result[0]
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
                axios.delete(`${conf.API}delete/opcion/${id}`)
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
            opcionCorrecta: e.target.value
        })
    }
    render() {
        return (
            <React.Fragment>
                <Alert severity="success" style={{ width: "50%", margin: "0px auto" }} className="mt-5">
                    Se esta añadiendo una opcion a la pregunta
                    <br/><strong>
                        <Link to={`/add/pregunta/${this.state.pregunta.id_test}`} color="success" underline="hover" component={RouterLink}>
                            {` ${this.state.pregunta.nombre}`}
                        </Link>
                    </strong>
                </Alert>
                <form action={`${conf.API}save/opcion`} method="post">
                    <input id="id_pregunta" name="id_pregunta" type="hidden" value={this.state.id_pregunta} />
                    <input id="prevPage" name="prevPage" type="hidden" value={window.location.href} />
                    <div style={{ width: "30%", margin: "0px auto", textAlign: "center" }} className="mt-5 row">

                        <TextField
                            required
                            id="opcion"
                            name="opcion"
                            maxRows={3}
                            label="Opcion"
                        />
                        <FormControl fullWidth className="mt-5">
                            <InputLabel id="label-anho">¿Es la opcione correcta?</InputLabel>
                            <Select
                                labelId="label-anho"
                                value={this.state.opcionCorrecta}
                                onChange={this.handleChange}
                                name="opcionCorrecta"
                                id="opcionCorrecta"
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
                                    <TableCell align="center">ID</TableCell>
                                    <TableCell align="center">Opcion</TableCell>
                                    <TableCell align="center">Opcion Correcta</TableCell>
                                    <TableCell align="center" colSpan={2}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.opciones.map((opcion) => (
                                    <TableRow
                                        key={opcion.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{opcion.id}</TableCell>
                                        <TableCell align="center">{opcion.opcion}</TableCell>
                                        <TableCell align="center">{opcion.opcionCorrecta === 1 ? "SI" : "NO"}</TableCell>
                                        <TableCell align="center">
                                            <IconButton aria-label="delete" color="error" onClick={(e) => { this.delete(e, opcion.id) }}>
                                                <DeleteIcon />
                                            </IconButton>
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

export default AddOpcion;