import React from "react";
import {
    Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput,
    TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell, IconButton,
    Link,TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';




class AddCompuesto extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temas: [],
            temaPadreSeleccionado: "",
            temaHijoSeleccionado: "",
            id_test: window.location.pathname.split("/")[3],
            compuestos: []

        }
        this.handleChangeTemaPadre = this.handleChangeTemaPadre.bind(this);
        this.handleChangeTemaHijo = this.handleChangeTemaHijo.bind(this);
    }
    handleChangeTemaPadre(e) {
        this.setState({
            temaPadreSeleccionado: e.target.value
        });
    }
    handleChangeTemaHijo(e) {
        this.setState({
            temaHijoSeleccionado: e.target.value
        });
    }
    componentWillMount() {
        setTimeout(() => {
            fetch(`${process.env.REACT_APP_API}temas`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        temas: data.result
                    });
                })
        }, 500);

        setTimeout(() => {
            fetch(`${process.env.REACT_APP_API}compuestos/${this.state.id_test}`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        compuestos: data.result
                    });
                })
        }, 500);
    }
    render() {
        return (
            <div>
                <form action={`${process.env.REACT_APP_API}save/compuesto`} method="post">
                    <input id="prevPage" name="prevPage" type="hidden" value={window.location.href} />
                    <input id="id_padre" name="id_padre" type="hidden" value={this.state.id_test} />
                    <div style={{ width: "30%", margin: "0px auto", textAlign: "center" }} className="mt-5 row">
                        <FormControl fullWidth className="mt-5">
                            <InputLabel id="label-bloque">Temas</InputLabel>
                            <Select
                                labelId="label-bloque"
                                value={this.state.temaHijoSeleccionado}
                                onChange={this.handleChangeTemaHijo}
                                name="id_hijo"
                                id="id_hijo"
                                input={<OutlinedInput label="Name" />}
                            >

                                {
                                    this.state.temas.length > 0 && this.state.temas !== undefined ?
                                        this.state.temas.map((tema) => (
                                            <MenuItem key={tema.id} value={tema.id}>{`${tema.nombre_bloque} - ${tema.nombre_corto}`}</MenuItem>
                                        ))
                                        : <MenuItem >No hay temas para este bloque</MenuItem>
                                }
                            </Select>
                        </FormControl>
                        <TextField
                        className="mt-5"
                            type="number"
                            required
                            id="orden"
                            name="orden"
                            maxRows={3}
                            label="Orden"
                        />
                        <Button className="mt-5" type="submit" variant="contained">Add</Button>
                    </div>
                </form >
                <div style={{ width: "80%", margin: "0px auto", textAlign: "center" }} className="mt-5 mb-5 row">
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">ID</TableCell>
                                    <TableCell align="left">Test hijo</TableCell>
                                    <TableCell align="center">orden</TableCell>
                                    <TableCell align="center" colSpan={2}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.compuestos.map((compuesto) => (
                                    < TableRow
                                        key={compuesto.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{compuesto.id}</TableCell>
                                        <TableCell align="left">{`${compuesto.id_hijo} - ${compuesto.Nombre}`}</TableCell>
                                        <TableCell align="center">{compuesto.orden}</TableCell>
                                        <TableCell align="center">
                                            <IconButton aria-label="delete" color="error" onClick={(e) => { this.delete(e, test.id_test) }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="center">
                                                {!compuesto.tieneSubtemas ?
                                                    <Link to={`/add/pregunta/${compuesto.id_hijo}`} color="success" underline="hover" component={RouterLink}>
                                                        <ArrowForwardIcon />
                                                    </Link>
                                                    : <Link to={`/add/compuesto/${compuesto.id_hijo}`} color="success" underline="hover" component={RouterLink}>
                                                        <ArrowForwardIcon />
                                                    </Link>}
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

export default AddCompuesto;