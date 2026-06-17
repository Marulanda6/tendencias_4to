import { z } from 'zod'; 
 
// Valida que la cédula sea una cadena de exactamente 10 dígitos. 
const cedulaSchema = z 
  .string() 
  .regex(/^\d{10}$/, 'La cédula debe tener exactamente 10 dígitos'); 
 
// Esquema reutilizable para nombres, apellidos y ciudad. 
// trim elimina espacios al inicio y al final. 
const textoSchema = z 
  .string() 
  .trim() 
  .min(2, 'Debe tener al menos 2 caracteres'); 
 
// Esquema para crear una persona. 
// Todos los campos son obligatorios. 
export const createPersonaSchema = z.object({ 
  cedula: cedulaSchema, 
  apellidos: textoSchema.max(80), 
  nombres: textoSchema.max(80), 
  fechaNacimiento: z.string().date('La fecha debe tener formato YYYY-MM-DD'), 
  direccion: z.string().trim().min(5).max(150), 
  ciudad: textoSchema.max(80) 
}); 
 
// Esquema para actualizar una persona. 
// Los campos son opcionales porque PATCH permite actualización parcial. 
export const updatePersonaSchema = z.object({ 
  apellidos: textoSchema.max(80).optional(), 
  nombres: textoSchema.max(80).optional(), 
  fechaNacimiento: z.string().date('La fecha debe tener formato YYYY-MM-DD').optional(), 
  direccion: z.string().trim().min(5).max(150).optional(), 
  ciudad: textoSchema.max(80).optional() 
}).refine((data) => Object.keys(data).length > 0, { 
  // Evita recibir un PATCH vacío, por ejemplo: {} 
  message: 'Debe enviar al menos un campo para actualizar' 
});