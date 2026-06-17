import { Router } from 'express'; 
import { 
  createPersona, 
  deletePersona, 
  findAllPersonas, 
  findPersonaByCedula, 
  updatePersona 
} from '../services/personas.service.js'; 
import { 
  createPersonaSchema, 
  updatePersonaSchema 
} from '../schemas/personas.schema.js'; 
 
const router = Router(); 
 
// GET /api/personas 
// Lista personas. Si llega ?ciudad=Guayaquil, filtra por ciudad. 
router.get('/', async (req, res, next) => { 
  try { 
    const personas = await findAllPersonas({ 
      ciudad: req.query.ciudad 
    }); 
 
    res.json({ data: personas }); 
  } catch (error) { 
    // next(error) envía el error al manejador global de Express. 
    next(error); 
  } 
}); 
 
// GET /api/personas/:cedula 
// Busca una persona específica. 
router.get('/:cedula', async (req, res, next) => { 
  try { 
    const persona = await findPersonaByCedula(req.params.cedula); 
 
    if (!persona) { 
      return res.status(404).json({ error: 'Persona no encontrada' }); 
    } 
 
 
 
    res.json({ data: persona }); 
  } catch (error) { 
    next(error); 
  } 
}); 
 
// POST /api/personas 
// Crea una nueva persona. 
router.post('/', async (req, res, next) => { 
  try { 
    // Valida el body antes de consultar MySQL. 
    const result = createPersonaSchema.safeParse(req.body); 
 
    if (!result.success) { 
      return res.status(400).json({ 
        error: 'Datos inválidos', 
        details: result.error.flatten() 
      }); 
    } 
 
    // Verifica duplicados para responder con un mensaje claro. 
    const exists = await findPersonaByCedula(result.data.cedula); 
 
    if (exists) { 
      return res.status(409).json({ 
        error: 'Ya existe una persona con esa cédula' 
      }); 
    } 
 
    const persona = await createPersona(result.data); 
    res.status(201).json({ data: persona }); 
  } catch (error) { 
    next(error); 
  } 
}); 
 
// PATCH /api/personas/:cedula 
// Actualiza parcialmente una persona. 
router.patch('/:cedula', async (req, res, next) => { 
  try { 
    const result = updatePersonaSchema.safeParse(req.body); 
 
    if (!result.success) { 
      return res.status(400).json({ 
        error: 'Datos inválidos', 
        details: result.error.flatten() 
      }); 
    } 
 
    const persona = await updatePersona(req.params.cedula, result.data); 
 
    if (!persona) { 
      return res.status(404).json({ error: 'Persona no encontrada' }); 
    } 
 
    res.json({ data: persona }); 
  } catch (error) { 
    next(error); 
  } 
 
 
}); 
 
// DELETE /api/personas/:cedula 
// Elimina una persona. Si no existe, responde 404. 
router.delete('/:cedula', async (req, res, next) => { 
  try { 
    const deleted = await deletePersona(req.params.cedula); 
 
    if (!deleted) { 
      return res.status(404).json({ error: 'Persona no encontrada' }); 
    } 
 
    // 204 significa éxito sin contenido en la respuesta. 
    res.status(204).send(); 
  } catch (error) { 
    next(error); 
  } 
}); 
 
export default router;