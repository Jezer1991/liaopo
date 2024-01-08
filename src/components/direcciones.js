import React from 'react';
import {
    Routes,
    Route,
    BrowserRouter as Router,
} from "react-router-dom";
import ErrorPage from './errorPage';
import Bloque from './bloque'
import Test from './test'
import AddBloque from './addBloque';
import AddTest from './addTest';
import AddPregunta from './addPregunta';
import AddOpcion from './addOpcion';
import Videos from './videos';
import Tema from './tema';

const Direcciones = () => {
    return (
        <Router>
            <Routes>
                
                <Route exact path="/" element={<Bloque />} />
                <Route exact path="/bloques" element={<Bloque />} />
                <Route exact path="/test/:id_test" element={<Test />} />
                <Route exact path="/add/bloque" element={<AddBloque />} />
                <Route exact path="/add/test" element={<AddTest />} />
                <Route exact path="/add/test/:id_bloque" element={<AddTest />} />
                <Route exact path="/add/pregunta/:id_test" element={<AddPregunta />} />
                <Route exact path="/add/opcion/:id_pregunta" element={<AddOpcion />} />
                <Route exact path="/videos" element={<Videos />} />
                <Route exact path="/temas" element={<Tema />} />
                <Route exact path="*" element={<ErrorPage />} />
            </Routes>
        </Router>
    );
}

export default Direcciones;