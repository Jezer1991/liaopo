import React from "react";

import { TextField, Button, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, FormControl, InputLabel, Select, OutlinedInput, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2'
import axios from 'axios';
import NoHayDatos from "./nohaydatos";
import { TextareaAutosize } from '@mui/base';
import * as conf from '../conf';




class Tema extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temas: [],
            bloques: [],
            bloqueSeleccionado: "",
            temasE: [],
            temaSeleccionado: ""
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        setTimeout(() => {
            fetch(`${conf.API_LOCAL}temas`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        temas: data.result
                    });
                })

            fetch(`${conf.API_LOCAL}bloques`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        bloques: data.result,
                    });
                })
        }, 500);
    }

    handleChange(e) {
        this.setState({
            bloqueSeleccionado: e.target.value,
        });
    }


    delete(e, id) {
        Swal.fire({
            title: 'Deseas eliminar el Tema?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Borrar!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${conf.API_LOCAL}delete/tema/${id}`)
                    .then(data => {
                        if (data.status === 200) {
                            Swal.fire({
                                title: 'Borrado',
                                text: 'El tema fue borrado',
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


    render() {
        return (
            <React.Fragment>
                <form action={`${conf.API_LOCAL}save/tema`} method="post">
                    <input id="prevPage" name="prevPage" type="hidden" value={window.location.href} />
                    <div style={{ width: "30%", margin: "0px auto", textAlign: "center" }} className="mt-5 row">
                        <TextField
                            required
                            id="nombre_corto"
                            name="nombre_corto"
                            label="Nombre del tema"
                        />

                        <TextareaAutosize
                            className="pb-5 mt-5"
                            required
                            id="nombre_largo"
                            name="nombre_largo"
                            placeholder="Nombre Largo"
                        />
                        <FormControl fullWidth className="mt-5">
                            <InputLabel id="label-bloque">Bloque</InputLabel>
                            <Select
                                labelId="label-bloque"
                                value={this.state.bloqueSeleccionado}
                                onChange={this.handleChange}
                                name="id_bloque"
                                id="id_bloque"
                                input={<OutlinedInput label="Name" />}
                            >
                                {this.state.bloques.map((bloque) => (
                                    <MenuItem key={bloque.id} value={bloque.id}>{bloque.nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button className="mt-5" type="submit" variant="contained">Add</Button>
                    </div>
                </form >
                {this.state.temas.length === 0 ?
                    <React.Fragment>
                        <NoHayDatos message={"En este momento no hay temas"} />
                    </React.Fragment>
                    :
                    <div style={{ width: "80%", margin: "0px auto", textAlign: "center" }} className="mt-5 mb-5 row">
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">ID</TableCell>
                                        <TableCell align="center">Nombre corto</TableCell>
                                        <TableCell align="center">Nombre Largo</TableCell>
                                        <TableCell align="center" colSpan={2}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.temas.map((tema) => (
                                        <TableRow
                                            key={tema.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{tema.id}</TableCell>
                                            <TableCell align="center">{tema.nombre_corto}</TableCell>
                                            <TableCell align="center">{tema.nombre_largo}</TableCell>
                                            <TableCell align="center">
                                                <IconButton aria-label="delete" color="error" onClick={(e) => { this.delete(e, tema.id) }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                }
            </React.Fragment>
        );
    }
}
export default Tema;