const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { query } = require("express");
const db = require("./config/db");
const multer = require('multer')
const path = require('path');
const fs = require('fs');
var url = require('url');
const dir = "../../../../../../../xampp/htdocs/";
const axios = require('axios');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, dir + 'dbImagenes/kairos/productos')))

var server = app.listen(3001, () => {
    console.log("Opos-Jez running");
});

app.get('/api/tests', (req, res) => {
    const sql = "SELECT " +
        " t.id as id_test," +
        " t.nombre as nombre_test," +
        " t.id_bloque," +
        " t.id_tipo_test," +
        " tt.nombre as nombre_tipo_test," +
        " b.nombre as nombre_bloque,"+
        " te.nombre_corto as nombre_corto_tema,"+
        " te.nombre_largo as nombre_largo_tema"+
        " FROM test t" +
        " INNER JOIN tipo_test tt on t.id_tipo_test = tt.id"+
        " INNER JOIN bloque b on b.id = t.id_bloque"+
        " INNER JOIN tema te on te.id = t.id_tema";
    db.query(sql, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
})


app.get('/api/tests/:id_bloque', async (req, res) => {
    const id = req.params.id_bloque;

    const sql = "SELECT " +
        " t.id as id_test," +
        " t.nombre as nombre_test," +
        " t.id_bloque," +
        " t.id_tipo_test," +
        " tt.nombre as nombre_tipo_test," +
        " b.nombre as nombre_bloque,"+
        " te.nombre_corto as nombre_corto_tema,"+
        " te.nombre_largo as nombre_largo_tema"+
        " FROM test t" +
        " INNER JOIN tipo_test tt on t.id_tipo_test = tt.id"+
        " INNER JOIN bloque b on b.id = t.id_bloque"+
        " INNER JOIN tema te on te.id = t.id_tema" +
        " WHERE t.id_bloque = ?";
    db.query(sql, id, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
})

app.get('/api/test/:id_test', async (req, res) => {
    const id = req.params.id_test;
    const sql = "SELECT" +
        " t.id as id_test," +
        " t.nombre as nombre_test," +
        " t.id_bloque," +
        " b.nombre as nombre_bloque," +
        " t.id_tipo_test," +
        " tt.nombre as nombre_tipo_test," +
        " te.nombre_corto as nombre_corto_tema,"+
        " te.nombre_largo as nombre_largo_tema"+
        " FROM test t" +
        " INNER JOIN tipo_test tt on t.id_tipo_test = tt.id" +
        " INNER JOIN bloque b on b.id = t.id_bloque" +
        " INNER JOIN tema te on te.id = t.id_tema" +
        " WHERE t.id = ?";
    db.query(sql, id, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
})

app.get('/api/bloques', (req, res) => {
    const sql = "SELECT * FROM bloque";
    db.query(sql, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
})

app.get('/api/temas', (req, res) => {
    const sql = "SELECT * FROM tema";
    db.query(sql, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
})

app.get('/api/bloque/:id_bloque', (req, res) => {
    const id = req.params.id_bloque;
    const sql = "SELECT * FROM bloque where id =?";
    db.query(sql, id, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
})


app.get('/api/preguntas/:id_test', (req, res) => {
    const id = req.params.id_test;
    const sql2 = "SELECT"+
    " p.id, p.nombre,"+
    " p.id_test, p.anho,"+ 
    " a.anho as annho"+
    " FROM pregunta p"+
    " INNER JOIN anho a on p.anho = a.id"+ 
    " where id_test = ?";
     db.query(sql2, id, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
})

app.get('/api/pregunta/:id_pregunta', (req, res) => {
    const id_pregunta = req.params.id_pregunta;
    const sql2 = "SELECT * FROM pregunta where id = ?";
    db.query(sql2, id_pregunta,async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
})

app.get('/api/opcion/:id_pregunta', (req, res) => {
    const id = req.params.id_pregunta;
    const sql2 = "SELECT * FROM opcion where id_pregunta = ?";
    db.query(sql2, id, async(err, result) => {
        res.send(result);
    });
})

app.get('/api/opciones/:id_test', (req, res) => {
    const id = req.params.id_test;
    const sql = "SELECT o.id as id_opcion, p.*, o.* FROM opcion o INNER JOIN pregunta p on p.id = o.id_pregunta WHERE p.id_test = ?";
    db.query(sql, id, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
})

app.get('/api/tema/:id_bloque', (req, res) => {
    const id = req.params.id_bloque;
    const sql = "SELECT "+
    "t.id, "+
    "t.nombre_corto, "+
    "t.nombre_largo, "+
    "t.id_bloque, "+
    "b.nombre as nombre_bloque "+
    "FROM tema t "+
    "INNER JOIN bloque b on t.id_bloque = b.id "+
    "WHERE t.id_bloque = ?";
    db.query(sql, id, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
})


app.get('/api/tipoTest', (req, res) => {
    const sql = "SELECT * FROM tipo_test";
    db.query(sql, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
})

app.get('/api/videos', (req, res) => {
    const sql = "SELECT * FROM video";
    db.query(sql, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
})

app.get('/api/anhos', (req, res) => {
    const sql = "SELECT * FROM anho";
    db.query(sql, async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
})


app.post('/api/save/bloque', (req, res) => {
    const nombre = req.body.nombre;
    const sql = "INSERT INTO bloque (nombre) VALUES(?);";
    db.query(sql, nombre, async(err, result) => {
        if (!err) return res.redirect(req.body.prevPage);
        res.send(err);
    });
});

app.post('/api/save/tema', (req, res) => {
    const nombre_corto = req.body.nombre_corto;
    const nombre_largo = req.body.nombre_largo;
    const id_bloque = req.body.id_bloque;
    const sql = "INSERT INTO tema (nombre_corto, nombre_largo, id_bloque) VALUES(?,?,?);";
    db.query(sql, [nombre_corto, nombre_largo,id_bloque], async (err, result) => {
        if (!err) return res.redirect(req.body.prevPage);
        res.send(err);
    });
});


app.delete('/api/delete/bloque/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM bloque where id = ?";
    db.query(sql, id, async(err, result) => {
        if (err != null) res.send(result);
        res.send(err);
    });
});

app.delete('/api/delete/tema/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM tema where id = ?";
    db.query(sql, id, async(err, result) => {
        if (err != null) res.send(result);
        res.send(err);
    });
});


app.post('/api/save/test', (req, res) => {
    const nombre = req.body.nombre;
    const bloque = req.body.bloque;
    const tipoTest = req.body.tipoTest;
    const sql = "INSERT INTO test (nombre, id_bloque, id_tipo_test) VALUES(?,?,?);";
    db.query(sql, [nombre, bloque, tipoTest], async(err, result) => {
        if (!err) return res.redirect(req.body.prevPage);
        res.send(err);
    });
});


app.delete('/api/delete/test/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM test where id = ?";
    db.query(sql, id, async(err, result) => {
        if (err != null) res.send(result);
        res.send(err);
    });
});


app.post('/api/save/pregunta', (req, res) => {
    const nombre = req.body.nombre;
    const id_test = req.body.id_test;
    const anho = req.body.anho;
    const sql = "INSERT INTO pregunta (nombre, id_test, anho) VALUES(?,?,?);";
    db.query(sql, [nombre, id_test, anho], async(err, result) => {
        if (!err) return res.redirect(req.body.prevPage);
        res.send(err);
    });
});


app.delete('/api/delete/pregunta/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM pregunta where id = ?";
    db.query(sql, id, async(err, result) => {
        if (err != null) res.send(result);
        res.send(err);
    });
});


app.post('/api/save/opcion', (req, res) => {
    const opcion = req.body.opcion;
    const id_pregunta = req.body.id_pregunta;
    const opcionCorrecta = req.body.opcionCorrecta;
    const sql = "INSERT INTO opcion (opcion, id_pregunta, opcionCorrecta) VALUES(?,?,?);";
    db.query(sql, [opcion, id_pregunta, opcionCorrecta], async(err, result) => {
        if (!err) return res.redirect(req.body.prevPage);
        res.send(err);
    });
});

app.delete('/api/delete/opcion/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM opcion where id = ?";
    db.query(sql, id, async(err, result) => {
        if (err != null) res.send(result);
        res.send(err);
    });
});


app.post('/api/login', (req, res) => {
    const usuario = req.body.usuario;
    const password = req.body.password;
    const sql = "SELECT * FROM usuario WHERE usuario = ? AND password = ?";
    db.query(sql, [usuario, password],async (err, result) => {
        if (err === null) {
            res.send({ code: 201, result });
        } else {
            res.send({ code: 202, err });
        }
    });
});