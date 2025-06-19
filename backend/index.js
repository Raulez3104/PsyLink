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
  database: "psylink4"
});
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'TU_SECRETO', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.user = decoded;
    next();
  });
}

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
            
            const payload = { id_psico: usuario.id_psico, email: usuario.email };
            const token = jwt.sign(payload, 'TU_SECRETO', { expiresIn: '8h' });
            res.status(200).json({ mensaje: "Inicio de sesión exitoso", token });
        });
    });
});

// =================== RUTAS PARA PACIENTES ===================

// Obtener todos los pacientes
app.get('/api/pacientes', authMiddleware, (req, res) => {
  const id_psico = req.user.id_psico;
  db.query('SELECT * FROM pacientes WHERE id_psico = ?', [id_psico], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener pacientes' });
    res.json(results);
  });
});

app.get('/api/pacientes/:id', authMiddleware, (req, res) => {
  const id_psico = req.user.id_psico;
  const id = req.params.id;
  db.query('SELECT * FROM pacientes WHERE id_paciente = ? AND id_psico = ?', [id, id_psico], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener paciente' });
    if (results.length === 0) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(results[0]);
  });
});

app.post('/api/pacientes', authMiddleware, (req, res) => {
  const id_psico = req.user.id_psico;
  const {
    nombres, apellidos, diagnostico, ingreso, ci, email, telefono,
    fecnac, direccion, estado_civil, educacion, profesion, estado
  } = req.body;

  const insertQuery = `
    INSERT INTO pacientes (
      nombres, apellidos, diagnostico, ingreso, ci, email, telefono,
      fecnac, direccion, estado_civil, educacion, profesion, estado, id_psico
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    nombres, apellidos, diagnostico || null, 
    ingreso ? new Date(ingreso) : new Date(),
    ci, email, telefono || null,
    fecnac ? new Date(fecnac) : null,
    direccion || null, estado_civil || null, 
    educacion || null, profesion || null,
    estado || 'activo',
    id_psico // <-- ¡Agrega esto!
  ];

  db.query(insertQuery, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al crear paciente' });
    res.status(201).json({ mensaje: 'Paciente creado', id_paciente: result.insertId });
  });
});

// Actualizar un paciente
app.put('/api/pacientes/:id', authMiddleware, (req, res) => {
  const id_psico = req.user.id_psico;
  const id = req.params.id;
  const {
    nombres, apellidos, diagnostico, ingreso, ci, email, telefono,
    fecnac, direccion, estado_civil, educacion, profesion, estado
  } = req.body;

  // Verifica que el paciente pertenezca al psicólogo
  db.query('SELECT id_paciente FROM pacientes WHERE id_paciente = ? AND id_psico = ?', [id, id_psico], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error interno del servidor' });
    if (results.length === 0) return res.status(404).json({ error: 'Paciente no encontrado' });

    const updateQuery = `
      UPDATE pacientes SET
        nombres = ?, apellidos = ?, diagnostico = ?, ingreso = ?, ci = ?, email = ?, telefono = ?,
        fecnac = ?, direccion = ?, estado_civil = ?, educacion = ?, profesion = ?, estado = ?
      WHERE id_paciente = ? AND id_psico = ?
    `;
    const values = [
      nombres, apellidos, diagnostico || null, 
      ingreso ? new Date(ingreso) : new Date(),
      ci, email, telefono || null,
      fecnac ? new Date(fecnac) : null,
      direccion || null, estado_civil || null, 
      educacion || null, profesion || null,
      estado || 'activo',
      id, id_psico
    ];

    db.query(updateQuery, values, (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar paciente' });
      res.json({ mensaje: 'Paciente actualizado' });
    });
  });
});

// Eliminar un paciente
app.delete('/api/pacientes/:id', authMiddleware, (req, res) => {
  const id_psico = req.user.id_psico;
  const id = req.params.id;
  db.query('DELETE FROM pacientes WHERE id_paciente = ? AND id_psico = ?', [id, id_psico], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar paciente' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json({ mensaje: 'Paciente eliminado' });
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
app.get('/api/usuario', authMiddleware, (req, res) => {
  const id_psico = req.user.id_psico;
  db.query(
    'SELECT nombre, paterno, materno, email, especialidad, DATE_FORMAT(fecNac, "%Y-%m-%d") AS fecNac FROM psicologo WHERE id_psico = ?',
    [id_psico],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al obtener usuario' });
      if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(results[0]);
    }
  );
});
app.put('/api/usuario', authMiddleware, (req, res) => {
  const id_psico = req.user.id_psico;
  let { nombre, paterno, materno, especialidad, fecNac } = req.body;
  console.log('Datos recibidos para actualizar:', req.body);

  if (!nombre || !paterno || !materno || !especialidad) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  if (!fecNac) fecNac = null;

  db.query(
    'UPDATE psicologo SET nombre=?, paterno=?, materno=?, especialidad=?, fecNac=? WHERE id_psico=?',
    [nombre, paterno, materno, especialidad, fecNac, id_psico],
    (err, result) => {
      if (err) {
        console.error('Error al actualizar usuario:', err);
        return res.status(500).json({ error: 'Error al actualizar usuario' });
      }
      res.json({ mensaje: 'Usuario actualizado correctamente' });
    }
  );
});
app.get('/api/agenda', authMiddleware, (req, res) => {
  const id_psico = req.user.id_psico;
  const sql = `
    SELECT a.*, CONCAT(p.nombres, ' ', p.apellidos) AS paciente_nombre
    FROM agenda a
    JOIN pacientes p ON a.id_paciente = p.id_paciente
    WHERE p.id_psico = ?
  `;
  db.query(sql, [id_psico], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener agenda' });
    res.json(results);
  });
});
app.post('/api/agenda', authMiddleware, (req, res) => {
  const { id_paciente, fecha, hora_inicio, hora_fin, repeticion } = req.body;
  if (!id_paciente || !fecha || !hora_inicio || !hora_fin || !repeticion) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const eventos = [];
  const fechaBase = new Date(fecha);
  const fechaLimite = new Date(fechaBase);
  fechaLimite.setMonth(fechaLimite.getMonth() + 1);

  if (repeticion === 'semana') {
    for (
      let fechaActual = new Date(fechaBase);
      fechaActual <= fechaLimite;
      fechaActual.setDate(fechaActual.getDate() + 7)
    ) {
      eventos.push([
        id_paciente,
        fechaActual.toISOString().split('T')[0],
        hora_inicio,
        hora_fin,
        repeticion
      ]);
    }
  } else if (repeticion === 'dos_veces') {
    for (
      let fechaActual = new Date(fechaBase);
      fechaActual <= fechaLimite;
      fechaActual.setDate(fechaActual.getDate() + 7)
    ) {
      // Primer día
      eventos.push([
        id_paciente,
        fechaActual.toISOString().split('T')[0],
        hora_inicio,
        hora_fin,
        repeticion
      ]);
      // Segundo día (tres días después)
      const segundaFecha = new Date(fechaActual);
      segundaFecha.setDate(segundaFecha.getDate() + 3);
      if (segundaFecha <= fechaLimite) {
        eventos.push([
          id_paciente,
          segundaFecha.toISOString().split('T')[0],
          hora_inicio,
          hora_fin,
          repeticion
        ]);
      }
    }
  }

  if (eventos.length === 0) {
    return res.status(400).json({ error: 'No se generaron eventos' });
  }

  db.query(
    'INSERT INTO agenda (id_paciente, fecha, hora_inicio, hora_fin, repeticion) VALUES ?',
    [eventos],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al crear cita' });
      res.json({ ok: true });
    }
  );
});
app.get('/api/agenda/:id', authMiddleware, (req, res) => {
  const id_psico = req.user.id_psico;
  const id_cita = req.params.id;
  const sql = `
    SELECT a.*, CONCAT(p.nombres, ' ', p.apellidos) AS paciente_nombre
    FROM agenda a
    JOIN pacientes p ON a.id_paciente = p.id_paciente
    WHERE a.id_cita = ? AND p.id_psico = ?
    LIMIT 1
  `;
  db.query(sql, [id_cita, id_psico], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener la cita' });
    if (!results.length) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(results[0]);
  });
});
app.put('/api/agenda/:id', authMiddleware, (req, res) => {
  const id_psico = req.user.id_psico;
  const id_cita = req.params.id;
  const { fecha, hora_inicio, hora_fin, descripcion, estado } = req.body;

  // Solo permite editar citas del psicólogo logueado
  const sql = `
    UPDATE agenda a
    JOIN pacientes p ON a.id_paciente = p.id_paciente
    SET a.fecha = ?, a.hora_inicio = ?, a.hora_fin = ?, a.descripcion = ?, a.estado = ?
    WHERE a.id_cita = ? AND p.id_psico = ?
  `;
  db.query(
    sql,
    [fecha, hora_inicio, hora_fin, descripcion, estado, id_cita, id_psico],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al editar la cita' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Cita no encontrada' });
      res.json({ ok: true });
    }
  );
});

// DELETE para eliminar una cita
app.delete('/api/agenda/:id', authMiddleware, (req, res) => {
  const id_psico = req.user.id_psico;
  const id_cita = req.params.id;

  // Solo permite eliminar citas del psicólogo logueado
  const sql = `
    DELETE a FROM agenda a
    JOIN pacientes p ON a.id_paciente = p.id_paciente
    WHERE a.id_cita = ? AND p.id_psico = ?
  `;
  db.query(sql, [id_cita, id_psico], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar la cita' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json({ ok: true });
  });
});
app.get('/api/sesiones-pendientes', authMiddleware, (req, res) => {
  const id_psico = req.user.id_psico;
  const hoy = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const sql = `
    SELECT COUNT(*) AS total
    FROM agenda a
    JOIN pacientes p ON a.id_paciente = p.id_paciente
    WHERE p.id_psico = ? AND a.estado = 'activa' AND a.fecha >= ?
  `;
  db.query(sql, [id_psico, hoy], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al contar sesiones' });
    res.json({ total: results[0].total });
  });
});
app.get('/api/turnos-hoy', authMiddleware, (req, res) => {
  const id_psico = req.user.id_psico;
  const hoy = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const sql = `
    SELECT COUNT(*) AS total
    FROM agenda a
    JOIN pacientes p ON a.id_paciente = p.id_paciente
    WHERE p.id_psico = ? AND a.estado = 'activa' AND a.fecha = ?
  `;
  db.query(sql, [id_psico, hoy], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al contar turnos de hoy' });
    res.json({ total: results[0].total });
  });
});
// Iniciar el servidor
app.listen(4000, () => {
  console.log("Escuchando en el puerto 4000");
});