import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import { Link, Tooltip, CardActions, CardContent, CardMedia, Typography, CardActionArea, AccordionSummary, Accordion, AccordionDetails } from '@mui/material';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import Card1 from '@mui/material/Card';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NoHayDatos from "./nohaydatos";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2


import 'react-multi-carousel/lib/styles.css';

import * as conf from '../conf';


class Bloque extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bloques: [],
            tests: []
        }
    }
    componentWillMount() {
        setTimeout(() => {
            fetch(`${conf.HOST}bloques`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    this.setState({
                        bloques: data.result
                    });
                })

            fetch(`${conf.HOST}tests`)
                .then(data => {
                    return data.json();
                }).then(data => {
                    console.log(data);
                    this.setState({
                        tests: data.result
                    });
                })
        });
    }
    render() {
        return (
            this.state.bloques === undefined  || this.state.bloques.length <= 0  ?
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

                                    {this.state.tests.filter(f => f.id_bloque === bloque.id).map((test, e) => (

                                        <Grid key={`G${e}`} xs={6} sm={6} md={3}>
                                            <Card1 sx={{ maxWidth: 500 }}>
                                                <CardActionArea>
                                                    <CardMedia
                                                        component="img"
                                                        height="140"
                                                        image={test.id_tipo_test === 2 ? "https://www.nextibs.com/wp-content/uploads/2021/12/seguridad-informatica-scaled.jpeg" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM14dRqIaoHzIF1ZPFedemtVAg-99ub0N7Kg&usqp=CAU"}
                                                        alt="test"
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h5" component="div">
                                                            {test.nombre_corto_tema}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {test.nombre_tipo_test}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions>
                                                        <Tooltip title="Ver test">
                                                            <Link to={`/test/${test.id_test}`} color="secondary" underline="hover" component={RouterLink}>
                                                                <FindInPageIcon />
                                                            </Link>
                                                        </Tooltip>
                                                    </CardActions>
                                                </CardActionArea>
                                            </Card1>
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Grid>
        );
    }

}

export default Bloque;