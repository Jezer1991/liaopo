import React from "react";

import { Link, TextField, Button, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton,FormControl,InputLabel, Select,OutlinedInput,MenuItem } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2'
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';


class AddBloque extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bloques: [],
        }
    }
    componentWillMount() {
        setTimeout(() => {
            fetch(`${process.env.REACT_APP_API}allBloques`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        bloques: data.result
                    });
                })
        });
    }



    delete(e, id) {

        Swal.fire({
            title: 'Deseas eliminar el Bloque?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Borrar!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${process.env.REACT_APP_API}delete/bloque/${id}`)
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


    render() {
        return (
            <div>
                <form action={`${process.env.REACT_APP_API}save/bloque`} method="post">
                    <input id="prevPage" name="prevPage" type="hidden" value={window.location.href} />
                    <div style={{ width: "30%", margin: "0px auto", textAlign: "center" }} className="mt-5 row">
                        <TextField
                            className="mb-5"
                            required
                            id="nombre"
                            name="nombre"
                            label="Nombre del Bloque"
                            defaultValue="Bloque 1"
                        />
                        <TextField
                            type="number"
                            required
                            id="bloque"
                            name="bloque"
                            label="bloque"
                        />
                        <FormControl fullWidth className="mt-5">
                            <InputLabel id="label-anho">¿Es un bloque para Examen?</InputLabel>
                            <Select
                                labelId="label-anho"
                                name="esExamen"
                                id="esExamen"
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
                                    <TableCell align="center">Nombre</TableCell>
                                    <TableCell align="center">¿Es de examen?</TableCell>
                                    <TableCell align="center" colSpan={2}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.bloques.map((bloque) => (
                                    <TableRow
                                        key={bloque.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{bloque.id}</TableCell>
                                        <TableCell align="center">{bloque.nombre}</TableCell>
                                        <TableCell align="center">{bloque.esExamen === 1 ? "SI" : "NO"}</TableCell>
                                        <TableCell align="center">
                                            <IconButton aria-label="delete" color="error" onClick={(e) => { this.delete(e, bloque.id) }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Link to={`/add/test/${bloque.id}`} color="success" underline="hover" component={RouterLink}>
                                                <QuestionAnswerIcon />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>

        );
    }
}
export default AddBloque;