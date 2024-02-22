import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import { Link, CircularProgress, Box, Tooltip, CardActions, CardContent, CardMedia, Typography, CardActionArea, AccordionSummary, Accordion, AccordionDetails, } from '@mui/material';
import Card1 from '@mui/material/Card';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NoHayDatos from "./nohaydatos";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Test from './_imagenes/test.svg';
import SeeTest from './_imagenes/seeTest.svg';

import 'react-multi-carousel/lib/styles.css';



class Examen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bloques: [],
            tests: [],
            loading: true
        }
    }
    componentDidMount() {
        setTimeout(() => {
            fetch(`${process.env.REACT_APP_API}examenes`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        bloques: data.result
                    });
                })

            fetch(`${process.env.REACT_APP_API}tests`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        tests: data.result,
                        loading: false
                    });
                })
        });
    }
    render() {
        return (
            this.state.loading ?
                <Box sx={{ width: '90%', alignItems: "center", textAlign: "center" }}>
                    <CircularProgress />
                </Box>
                :
                this.state.bloques === undefined || this.state.bloques.length <= 0 ?
                    <React.Fragment>
                        <NoHayDatos message={"No hay bloques en este momento"} />
                    </React.Fragment>

                    : <Grid >
                        {this.state.bloques.map((bloque, i) => (
                            <Accordion key={`A${i}`} style={{ marginBottom: "10px", borderRadius: "10px", border: "0px" }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    style={{ background: "rgb(195,195,195)", color: "rgb(69,73,80)", borderRadius: "10px", border: "0px" }}
                                >
                                    <Typography style={{ fontWeight: "600" }}>{bloque.nombre}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid style={{ width: "90%", margin: "0px auto", marginTop: "30px", marginBottom: "30px" }} container spacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1 }}>


                                        {this.state.tests.filter(f => f.id_bloque === bloque.id).length > 0

                                            ? this.state.tests.filter(f => f.id_bloque === bloque.id).map((test, e) => (

                                                <Grid key={`G${e}`} style={{ minWidth: "200px", alignItems: "center" }}>
                                                    <Card1>
                                                        <CardActionArea>
                                                            <CardMedia
                                                                component="img"
                                                                height="100"
                                                                image={test.id_tipo_test === 2 ? "https://www.nextibs.com/wp-content/uploads/2021/12/seguridad-informatica-scaled.jpeg" : "https://img.freepik.com/vector-gratis/gestion-financiera-elementos-profesionales_23-2147680889.jpg"}
                                                                alt="test"
                                                            />
                                                            <CardContent>
                                                                <Typography gutterBottom variant="h6" component="div">
                                                                    {test.nombre_corto_tema}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {test.nombre_tipo_test}
                                                                </Typography>
                                                            </CardContent>
                                                            <CardActions>
                                                                <Tooltip title="Ver test">
                                                                    <Link to={`/test/id/${test.id_test}`} style={{ color: "white", textDecoration: "none", cursor: "pointer" }} component={RouterLink}>
                                                                        <img
                                                                            alt=""
                                                                            src={SeeTest}
                                                                            width="45"
                                                                            height="45"
                                                                            className="d-inline-block align-top"
                                                                        />
                                                                    </Link>
                                                                </Tooltip>
                                                                <Tooltip title="Realizar test" >
                                                                    <Link to={`/test/start/${test.id_test}`} style={{ color: "white", textDecoration: "none", cursor: "pointer" }} component={RouterLink}>
                                                                        <img
                                                                            alt=""
                                                                            src={Test}
                                                                            width="35"
                                                                            height="35"
                                                                            className="d-inline-block align-top"
                                                                        />
                                                                    </Link>
                                                                </Tooltip>
                                                            </CardActions>
                                                        </CardActionArea>
                                                    </Card1>
                                                </Grid>
                                            )) :
                                            <React.Fragment>
                                                <h4 style={{ color: "darkgray", fontWeight: 700 }}>No hay tests en estos momentos para el bloque</h4>
                                            </React.Fragment>
                                        }
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Grid>
        );
    }

}

export default Examen;