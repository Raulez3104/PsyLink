const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");

app.use(cors());
// Middleware para poder trabajar con req.body
app.use(express.json()); // Para parsear cuerpos JSON

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "psylink"
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
  } else {
    console.log('Conectado a MySQL');
  }
});

app.post('/api/registro', (req, res) => {
    const { nombre, paterno, materno, email, contrasena, fecNac, especialidad } = req.body;

    // Encriptar la contraseña antes de insertarla
    bcrypt.hash(contrasena, 10, (err, hashedPassword) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al encriptar la contraseña");
        }

        const query = 'INSERT INTO psicologo (nombre, paterno, materno, email, contrasena, fecNac, especialidad) VALUES (?, ?, ?, ?, ?, ?, ?)';
        
        db.query(query, [nombre, paterno, materno, email, hashedPassword, fecNac, especialidad], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al registrar el psicólogo");
            } else {
                res.send("Psicólogo registrado exitosamente");
            }
        });
    });
});


app.post('/api/login', (req, res) => {
    const { email, contrasena } = req.body;

    const query = 'SELECT * FROM psicologo WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).send("Error en el servidor");
        if (results.length === 0) return res.status(401).send("Usuario no encontrado");

        const usuario = results[0];

        // Comparamos la contraseña ingresada con la encriptada
        bcrypt.compare(contrasena, usuario.contrasena, (err, esCorrecta) => {
            if (err) return res.status(500).send("Error al verificar la contraseña");
            if (!esCorrecta) return res.status(401).send("Contraseña incorrecta");

            // Éxito: puedes enviar los datos o un token
            res.status(200).json({ mensaje: "Inicio de sesión exitoso", usuario });
        });
    });
});

// Iniciar el servidor
app.listen(4000, () => {
  console.log("Escuchando en el puerto 4000");
});
