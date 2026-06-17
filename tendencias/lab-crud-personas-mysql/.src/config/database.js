// Importa el cliente de MySQL con soporte para promesas. 
import mysql from 'mysql2/promise'; 
 
// Crea un pool de conexiones reutilizable. 
// Los datos de conexión se leen desde el archivo .env mediante process.env. 
export const pool = mysql.createPool({ 
  host: process.env.DB_HOST, 
  port: Number(process.env.DB_PORT), 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME, 
 
 
 
  // Si todas las conexiones están ocupadas, espera hasta que una esté disponible. 
  waitForConnections: true, 
 
  // Número máximo de conexiones simultáneas en el pool. 
  connectionLimit: 10, 
 
  // 0 significa que no se limita la cola de espera. 
  queueLimit: 0 
}); 
 
// Función auxiliar usada por /health para verificar si MySQL responde. 
export async function checkDatabaseConnection() { 
  // Solicita una conexión del pool. 
  const connection = await pool.getConnection(); 
 
  try { 
    // ping comprueba que la conexión esté activa. 
    await connection.ping(); 
    return true; 
  } finally { 
    // Siempre se libera la conexión para que vuelva al pool. 
    connection.release(); 
  } 
} 