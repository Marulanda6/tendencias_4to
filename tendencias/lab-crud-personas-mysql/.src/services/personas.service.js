import { pool } from '../config/database.js'; 
 
// Convierte una fila de MySQL al formato que devuelve la API. 
function mapPersona(row) { 
  return { 
    cedula: row.cedula, 
    apellidos: row.apellidos, 
    nombres: row.nombres, 
    fechaNacimiento: row.fecha_nacimiento, 
    direccion: row.direccion, 
    ciudad: row.ciudad, 
    createdAt: row.created_at, 
    updatedAt: row.updated_at 
  }; 
} 
 
// Consulta todas las personas. 
export async function findAllPersonas(filters = {}) { 
  const params = []; 
  let sql = 'SELECT * FROM personas'; 
 
  if (filters.ciudad) { 
    sql += ' WHERE ciudad = ?'; 
    params.push(filters.ciudad); 
  } 
 
  sql += ' ORDER BY apellidos ASC, nombres ASC'; 
  const [rows] = await pool.execute(sql, params); 
  return rows.map(mapPersona); 
} 
 
// Busca una persona por su cédula. 
export async function findPersonaByCedula(cedula) { 
  const [rows] = await pool.execute( 
    'SELECT * FROM personas WHERE cedula = ? LIMIT 1', 
    [cedula] 
  ); 
  return rows.length ? mapPersona(rows[0]) : null; 
} 
 
// Crea una persona en MySQL. 
export async function createPersona(data) { 
  await pool.execute( 
    `INSERT INTO personas (cedula, apellidos, nombres, fecha_nacimiento, direccion, ciudad) 
     VALUES (?, ?, ?, ?, ?, ?)`, 
    [data.cedula, data.apellidos, data.nombres, data.fechaNacimiento, data.direccion, data.ciudad] 
  ); 
  return findPersonaByCedula(data.cedula); 
} 
 
// Actualiza una persona existente. 
export async function updatePersona(cedula, data) { 
  const current = await findPersonaByCedula(cedula); 
  if (!current) return null; 
 
  const next = { 
    apellidos: data.apellidos ?? current.apellidos, 
    nombres: data.nombres ?? current.nombres, 
    fechaNacimiento: data.fechaNacimiento ?? current.fechaNacimiento, 
    direccion: data.direccion ?? current.direccion, 
    ciudad: data.ciudad ?? current.ciudad 
  }; 
 
  await pool.execute( 
    `UPDATE personas SET apellidos = ?, nombres = ?, fecha_nacimiento = ?, direccion = ?, ciudad = ? WHERE cedula = ?`, 
    [next.apellidos, next.nombres, next.fechaNacimiento, next.direccion, next.ciudad, cedula] 
  ); 
  return findPersonaByCedula(cedula); 
} 
 
// Elimina una persona por cédula. 
export async function deletePersona(cedula) { 
  const [result] = await pool.execute('DELETE FROM personas WHERE cedula = ?', [cedula]); 
  return result.affectedRows > 0; 
}