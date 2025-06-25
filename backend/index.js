const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const fetch = require('node-fetch');
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const axios=require ("axios");

app.use(cors());
// Middleware para poder trabajar con req.body
app.use(express.json()); // Para parsear cuerpos JSON
const contextChunks = [
  "Psylink es una plataforma digital diseñada como herramienta complementaria para psicólogos.",
  "Permite a los profesionales administrar test psicológicos validados, diarios emocionales, y realizar seguimientos personalizados.",
  "La plataforma no realiza diagnósticos automáticos, sino que actúa bajo la supervisión directa del profesional de salud mental.",
  "Psylink cuenta con funcionalidades como gestión de pacientes, agenda, historias clínicas y análisis mediante inteligencia artificial.",
  "Está enfocada en brindar apoyo ético y clínico, respetando la privacidad del usuario y cumpliendo estándares profesionales.",
  "Para más información o contacto, puedes ir a la pestaña de contacto y dejar tus datos: nombre, correo, país, teléfono y mensaje."
];
function getRelevantContext(question) {
  return contextChunks.filter(chunk =>
    question.toLowerCase().split(" ").some(word =>
      chunk.toLowerCase().includes(word)
    )
  ).join("\n\n");
}
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

    // Buscar en admin primero
    db.query('SELECT * FROM admin WHERE email = ?', [email], (err, adminResults) => {
        if (err) return res.status(500).send("Error en el servidor");
        if (adminResults.length > 0) {
            const admin = adminResults[0];
            bcrypt.compare(contrasena, admin.password, (err, esCorrecta) => {
                if (err) return res.status(500).send("Error al verificar la contraseña");
                if (!esCorrecta) return res.status(401).send("Contraseña incorrecta");
                const payload = { id_admin: admin.id_admin, email: admin.email, tipo: "admin" };
                const token = jwt.sign(payload, 'TU_SECRETO', { expiresIn: '8h' });
                return res.status(200).json({ mensaje: "Inicio de sesión exitoso", token, tipo: "admin" });
            });
        } else {
            // Si no es admin, buscar en psicologo
            db.query('SELECT * FROM psicologo WHERE email = ?', [email], (err, results) => {
                if (err) return res.status(500).send("Error en el servidor");
                if (results.length === 0) return res.status(401).send("Usuario no encontrado");

                const usuario = results[0];
                bcrypt.compare(contrasena, usuario.contrasena, (err, esCorrecta) => {
                    if (err) return res.status(500).send("Error al verificar la contraseña");
                    if (!esCorrecta) return res.status(401).send("Contraseña incorrecta");
                    const payload = { id_psico: usuario.id_psico, email: usuario.email, tipo: "psicologo" };
                    const token = jwt.sign(payload, 'TU_SECRETO', { expiresIn: '8h' });
                    res.status(200).json({ mensaje: "Inicio de sesión exitoso", token, tipo: "psicologo" });
                });
            });
        }
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
app.get('/api/pacientes/activos/count', authMiddleware, (req, res) => {
  const id_psico = req.user.id_psico;

  const query = `
    SELECT COUNT(*) AS totalActivos
    FROM pacientes
    WHERE estado = 'activo' AND id_psico = ?
  `;

  db.query(query, [id_psico], (err, results) => {
    if (err) {
      console.error('Error al obtener cantidad de pacientes activos:', err);
      return res.status(500).json({ error: 'Error al obtener la cantidad de pacientes activos' });
    }

    const totalActivos = results[0]?.totalActivos || 0;
    res.json({ totalActivos });
  });
});
app.get('/api/usuario', authMiddleware, (req, res) => {
  const { tipo } = req.user;

  if (tipo === 'psicologo') {
    const id_psico = req.user.id_psico;
    db.query(
      'SELECT nombre, paterno, materno, email, especialidad, DATE_FORMAT(fecNac, "%Y-%m-%d") AS fecNac FROM psicologo WHERE id_psico = ?',
      [id_psico],
      (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener usuario' });
        if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ tipo, ...results[0] });
      }
    );
  } else if (tipo === 'admin') {
    const id_admin = req.user.id_admin;
    db.query(
      'SELECT nombre, apellido_paterno AS paterno, apellido_materno AS materno, email, DATE_FORMAT(fecha_nacimiento, "%Y-%m-%d") AS fecNac FROM admin WHERE id_admin = ?',
      [id_admin],
      (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener admin' });
        if (results.length === 0) return res.status(404).json({ error: 'Administrador no encontrado' });
        res.json({ tipo, ...results[0] });
      }
    );
  } else {
    res.status(403).json({ error: 'Tipo de usuario no válido' });
  }
});
app.put('/api/usuario', authMiddleware, (req, res) => {
  const { tipo } = req.user;

  if (tipo === 'psicologo') {
    const id_psico = req.user.id_psico;
    let { nombre, paterno, materno, especialidad, fecNac } = req.body;

    if (!nombre || !paterno || !materno || !especialidad) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    if (!fecNac) fecNac = null;

    db.query(
      'UPDATE psicologo SET nombre=?, paterno=?, materno=?, especialidad=?, fecNac=? WHERE id_psico=?',
      [nombre, paterno, materno, especialidad, fecNac, id_psico],
      (err) => {
        if (err) {
          console.error('Error al actualizar psicólogo:', err);
          return res.status(500).json({ error: 'Error al actualizar usuario' });
        }
        res.json({ mensaje: 'Psicólogo actualizado correctamente' });
      }
    );

  } else if (tipo === 'admin') {
    const id_admin = req.user.id_admin;
    let { nombre, paterno, materno, fecNac } = req.body;

    if (!nombre || !paterno || !materno) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    if (!fecNac) fecNac = null;

    db.query(
      'UPDATE admin SET nombre=?, apellido_paterno=?, apellido_materno=?, fecha_nacimiento=? WHERE id_admin=?',
      [nombre, paterno, materno, fecNac, id_admin],
      (err) => {
        if (err) {
          console.error('Error al actualizar admin:', err);
          return res.status(500).json({ error: 'Error al actualizar admin' });
        }
        res.json({ mensaje: 'Administrador actualizado correctamente' });
      }
    );

  } else {
    res.status(403).json({ error: 'Tipo de usuario no válido' });
  }
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
app.post('/api/tareas', authMiddleware, (req, res) => {
  const {
    id_paciente,
    id_psico,
    titulo,
    descripcion,
    tipo,
    fecha_asignacion,
    fecha_entrega,
    estado
  } = req.body;

  if (!id_paciente || !id_psico || !titulo || !tipo || !fecha_asignacion) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const sql = `
    INSERT INTO tareas
    (id_paciente, id_psico, titulo, descripcion, tipo, fecha_asignacion, fecha_entrega, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      id_paciente,
      id_psico,
      titulo,
      descripcion || null,
      tipo,
      fecha_asignacion,
      fecha_entrega || null,
      estado || 'pendiente'
    ],
    (err, result) => {
      if (err) {
        console.error("Error al asignar tarea:", err);
        return res.status(500).json({ error: "Error al asignar tarea" });
      }
      res.json({ mensaje: "Tarea asignada correctamente", id_tarea: result.insertId });
    }
  );
});
app.get('/api/tareas', authMiddleware, (req, res) => {
  const sql = `
    SELECT 
      t.id_tarea, 
      t.id_paciente, 
      t.id_psico, 
      t.titulo, 
      t.descripcion, 
      t.tipo, 
      DATE_FORMAT(t.fecha_asignacion, "%Y-%m-%d") AS fecha_asignacion,
      t.fecha_entrega, 
      t.estado,
      CONCAT(p.nombres, ' ', p.apellidos) AS paciente_nombre
    FROM tareas t
    JOIN pacientes p ON t.id_paciente = p.id_paciente
    ORDER BY t.fecha_asignacion DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener tareas:", err);
      return res.status(500).json({ error: "Error al obtener tareas" });
    }
    res.json(results);
  });
});
app.get('/api/diario/:id_paciente', authMiddleware, (req, res) => {
  const { id_paciente } = req.params;
  const sql = `
    SELECT * FROM diario
    WHERE id_paciente = ?
    ORDER BY fecha DESC
  `;
  db.query(sql, [id_paciente], (err, results) => {
    if (err) {
      console.error("Error al obtener diarios:", err);
      return res.status(500).json({ error: "Error al obtener diarios" });
    }
    res.json(results);
  });
});

// Crear nuevo diario
app.post('/api/diario', authMiddleware, (req, res) => {
  const { id_paciente, fecha, emocion_principal, intensidad, contenido } = req.body;
  if (!id_paciente || !fecha || !emocion_principal || !intensidad || !contenido) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  const sql = `
    INSERT INTO diario (id_paciente, fecha, emocion_principal, intensidad, contenido)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [id_paciente, fecha, emocion_principal, intensidad, contenido], (err, result) => {
    if (err) {
      console.error("Error al guardar diario:", err);
      return res.status(500).json({ error: "Error al guardar diario" });
    }
    res.json({ mensaje: "Diario guardado correctamente", id_diario: result.insertId });
  });
});
app.post('/api/register-admin', (req, res) => {
  const { nombre, apellido_paterno, apellido_materno, fecha_nacimiento, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = `
    INSERT INTO admin 
    (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, email, password) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [nombre, apellido_paterno, apellido_materno, fecha_nacimiento, email, hashedPassword], (err, result) => {
    if (err) {
      console.error(err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send("El correo ya está registrado");
      }
      return res.status(500).send("Error al registrar al administrador");
    }

    res.status(201).json({ mensaje: "Administrador registrado correctamente" });
  });
});
app.get('/api/psicologos', authMiddleware, (req, res) => {
  const query = `
    SELECT id_psico, nombre, paterno, materno, email, especialidad, fecNac
    FROM psicologo
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los psicólogos:', err);
      return res.status(500).json({ error: 'Error al obtener los psicólogos' });
    }
    res.json(results);
  });
});
app.post("/api/save", (req, res) => {
  const { nombre, correo,pais, mensaje ,telefono } = req.body;
  console.log("Registro");
  console.log("Datos recibidos en el servidor como JSON:", req.body);

  if (!nombre || !correo) {
    return res
      .status(400)
      .json({ error: "Nombre, email son campos requeridos." });
  }
  console.log("Datos recibidos:", req.nombre, req.correo,req.pais, req.mensaje, req.telefono);

  const query =
    "INSERT INTO contactos (nombre, email,mensaje, telefono) VALUES (?,?, ?, ?)";
  dbConnection.query(query, [nombre, correo, mensaje, telefono], (error, results) => {
    if (error) {
      console.error("Error al insertar datos en la tabla:", error);
      return res
        .status(500)
        .json({ error: "Error al guardar los datos en la base de datos." });
    }

    res.status(201).json({
      message: "Datos guardados correctamente.",
      id: results.insertId,
    });
  });
});
app.post("/ollama-prompt", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Se requiere una pregunta" });
    }

    const context = getRelevantContext(question);

    const finalPrompt = `
Eres un asistente para una plataforma de apoyo psicológico llamada Psylink. Responde solo con base en el siguiente contexto.
Si la información no está en el contexto, responde: "Lo siento, no tengo información sobre eso."

Contexto:
${context}

Pregunta: ${question}
`;

    // Llamada a Ollama como ya la tienes
    const ollamaResponse = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      {
        model: "llama3",
        prompt: finalPrompt,
        stream: true,
      },
      { responseType: "stream" }
    );

    let result = "";
    ollamaResponse.data.on("data", (chunk) => {
      const lines = chunk.toString().split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) result += json.response;
        } catch (e) {
          // ignorar líneas mal formateadas
        }
      }
    });

    ollamaResponse.data.on("end", () => {
      res.json({ response: result.trim() });
    });

    ollamaResponse.data.on("error", (err) => {
      res.status(500).json({ error: err.message });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Iniciar el servidor
app.listen(4000, () => {
  console.log("Escuchando en el puerto 4000");
});