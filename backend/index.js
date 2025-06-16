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
  database: "psylink2"
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
  } else {
    console.log('Conectado a MySQL');
  }
});

// Rutas existentes para psicólogos
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

// =================== RUTAS PARA PACIENTES ===================

// Obtener todos los pacientes
app.get('/api/pacientes', (req, res) => {
    const query = `
        SELECT id_paciente, nombres, apellidos, diagnostico, ingreso, ci, email, 
               telefono, fecnac, direccion, estado_civil, educacion, profesion, estado
        FROM pacientes
        ORDER BY nombres, apellidos
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener pacientes:', err);
            return res.status(500).json({ error: 'Error al obtener los pacientes' });
        }
        
        // Formatear las fechas para el frontend
        const pacientes = results.map(paciente => ({
            ...paciente,
            ingreso: paciente.ingreso ? new Date(paciente.ingreso).toISOString() : null,
            fecnac: paciente.fecnac ? new Date(paciente.fecnac).toISOString() : null
        }));
        
        res.json(pacientes);
    });
});

// Obtener un paciente por ID
app.get('/api/pacientes/:id', (req, res) => {
    const { id } = req.params;
    
    const query = `
        SELECT id_paciente, nombres, apellidos, diagnostico, ingreso, ci, email, 
               telefono, fecnac, direccion, estado_civil, educacion, profesion, estado
        FROM pacientes 
        WHERE id_paciente = ?
    `;
    
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener paciente:', err);
            return res.status(500).json({ error: 'Error al obtener el paciente' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        
        const paciente = {
            ...results[0],
            ingreso: results[0].ingreso ? new Date(results[0].ingreso).toISOString() : null,
            fecnac: results[0].fecnac ? new Date(results[0].fecnac).toISOString() : null
        };
        
        res.json(paciente);
    });
});

// Crear un nuevo paciente
app.post('/api/pacientes', (req, res) => {
    const {
        nombres, apellidos, diagnostico, ingreso, ci, email, telefono,
        fecnac, direccion, estado_civil, educacion, profesion, estado
    } = req.body;

    // Validar campos obligatorios
    if (!nombres || !apellidos || !ci || !email) {
        return res.status(400).json({ 
            error: 'Los campos nombres, apellidos, CI y email son obligatorios' 
        });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido' });
    }

    // Verificar si el CI ya existe
    const checkCiQuery = 'SELECT id_paciente FROM pacientes WHERE ci = ?';
    db.query(checkCiQuery, [ci], (err, results) => {
        if (err) {
            console.error('Error al verificar CI:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ error: 'Ya existe un paciente con este CI' });
        }

        // Insertar nuevo paciente
        const insertQuery = `
            INSERT INTO pacientes (
                nombres, apellidos, diagnostico, ingreso, ci, email, telefono,
                fecnac, direccion, estado_civil, educacion, profesion, estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            nombres, apellidos, diagnostico || null, 
            ingreso ? new Date(ingreso) : new Date(),
            ci, email, telefono || null,
            fecnac ? new Date(fecnac) : null,
            direccion || null, estado_civil || null, 
            educacion || null, profesion || null,
            estado || 'activo'
        ];

        db.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error('Error al crear paciente:', err);
                return res.status(500).json({ error: 'Error al crear el paciente' });
            }

            // Obtener el paciente recién creado
            const selectQuery = `
                SELECT id_paciente, nombres, apellidos, diagnostico, ingreso, ci, email, 
                       telefono, fecnac, direccion, estado_civil, educacion, profesion, estado
                FROM pacientes 
                WHERE id_paciente = ?
            `;

            db.query(selectQuery, [result.insertId], (err, results) => {
                if (err) {
                    console.error('Error al obtener paciente creado:', err);
                    return res.status(500).json({ error: 'Error al obtener el paciente creado' });
                }

                const paciente = {
                    ...results[0],
                    ingreso: results[0].ingreso ? new Date(results[0].ingreso).toISOString() : null,
                    fecnac: results[0].fecnac ? new Date(results[0].fecnac).toISOString() : null
                };

                res.status(201).json(paciente);
            });
        });
    });
});

// Actualizar un paciente
app.put('/api/pacientes/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombres, apellidos, diagnostico, ingreso, ci, email, telefono,
        fecnac, direccion, estado_civil, educacion, profesion, estado
    } = req.body;

    // Validar campos obligatorios
    if (!nombres || !apellidos || !ci || !email) {
        return res.status(400).json({ 
            error: 'Los campos nombres, apellidos, CI y email son obligatorios' 
        });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido' });
    }

    // Verificar si el CI ya existe en otro paciente
    const checkCiQuery = 'SELECT id_paciente FROM pacientes WHERE ci = ? AND id_paciente != ?';
    db.query(checkCiQuery, [ci, id], (err, results) => {
        if (err) {
            console.error('Error al verificar CI:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ error: 'Ya existe otro paciente con este CI' });
        }

        // Actualizar paciente
        const updateQuery = `
            UPDATE pacientes SET 
                nombres = ?, apellidos = ?, diagnostico = ?, ingreso = ?, ci = ?, 
                email = ?, telefono = ?, fecnac = ?, direccion = ?, estado_civil = ?, 
                educacion = ?, profesion = ?, estado = ?
            WHERE id_paciente = ?
        `;

        const values = [
            nombres, apellidos, diagnostico || null,
            ingreso ? new Date(ingreso) : null,
            ci, email, telefono || null,
            fecnac ? new Date(fecnac) : null,
            direccion || null, estado_civil || null,
            educacion || null, profesion || null,
            estado || 'activo',
            id
        ];

        db.query(updateQuery, values, (err, result) => {
            if (err) {
                console.error('Error al actualizar paciente:', err);
                return res.status(500).json({ error: 'Error al actualizar el paciente' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Paciente no encontrado' });
            }

            // Obtener el paciente actualizado
            const selectQuery = `
                SELECT id_paciente, nombres, apellidos, diagnostico, ingreso, ci, email, 
                       telefono, fecnac, direccion, estado_civil, educacion, profesion, estado
                FROM pacientes 
                WHERE id_paciente = ?
            `;

            db.query(selectQuery, [id], (err, results) => {
                if (err) {
                    console.error('Error al obtener paciente actualizado:', err);
                    return res.status(500).json({ error: 'Error al obtener el paciente actualizado' });
                }

                const paciente = {
                    ...results[0],
                    ingreso: results[0].ingreso ? new Date(results[0].ingreso).toISOString() : null,
                    fecnac: results[0].fecnac ? new Date(results[0].fecnac).toISOString() : null
                };

                res.json(paciente);
            });
        });
    });
});

// Eliminar un paciente
app.delete('/api/pacientes/:id', (req, res) => {
    const { id } = req.params;

    // Verificar si el paciente existe
    const checkQuery = 'SELECT id_paciente FROM pacientes WHERE id_paciente = ?';
    db.query(checkQuery, [id], (err, results) => {
        if (err) {
            console.error('Error al verificar paciente:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

        // Eliminar paciente
        const deleteQuery = 'DELETE FROM pacientes WHERE id_paciente = ?';
        db.query(deleteQuery, [id], (err, result) => {
            if (err) {
                console.error('Error al eliminar paciente:', err);
                return res.status(500).json({ error: 'Error al eliminar el paciente' });
            }

            res.json({ message: 'Paciente eliminado exitosamente' });
        });
    });
});
// Obtener cantidad de pacientes activos
app.get('/api/pacientes/activos/count', (req, res) => {
  const query = `SELECT COUNT(*) AS total FROM pacientes WHERE estado = 'activo'`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener cantidad de pacientes activos:', err);
      return res.status(500).json({ error: 'Error al obtener la cantidad de pacientes activos' });
    }
    const totalActivos = results[0].total;
    res.json({ totalActivos });
  });
});

// Obtener diarios de un paciente
app.get('/api/diarios/:idPaciente', (req, res) => {
  const id = req.params.idPaciente;
  const sql = `
    SELECT id_diario, fecha, emocion_principal, intensidad, contenido
    FROM diario_emocional
    WHERE id_paciente = ?
    ORDER BY fecha DESC
  `;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener diarios' });
    res.json(result);
  });
});
app.get('/api/tests', async (req, res) => {
  const { id_psico } = req.query;
  const tests = await db.query('SELECT * FROM tests WHERE id_psico = ?', [id_psico]);
  res.json(tests);
});


// Iniciar el servidor
app.listen(4000, () => {
  console.log("Escuchando en el puerto 4000");
});