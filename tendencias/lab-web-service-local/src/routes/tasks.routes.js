import { Router } from 'express'; 
import { z } from 'zod'; 
import { 
  createTask, 
  deleteTask, 
  findAllTasks, 
  findTaskById, 
  updateTask 
} from '../services/tasks.service.js'; 
 
const router = Router(); 
 
const createTaskSchema = z.object({ 
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres') 
}); 
 
const updateTaskSchema = z.object({
     title: z.string().min(3).optional(), 
  completed: z.boolean().optional() 
}).refine((data) => Object.keys(data).length > 0, { 
  message: 'Debe enviar al menos un campo para actualizar' 
}); 
 
router.get('/', (req, res) => { 
  res.json({ 
    data: findAllTasks() 
  }); 
}); 
 
router.get('/:id', (req, res) => { 
  const task = findTaskById(req.params.id); 
 
  if (!task) { 
    return res.status(404).json({ 
      error: 'Tarea no encontrada' 
    }); 
  } 
 
  res.json({ 
    data: task 
  }); 
}); 
 
router.post('/', (req, res) => { 
  const result = createTaskSchema.safeParse(req.body); 
 
  if (!result.success) { 
    return res.status(400).json({ 
      error: 'Datos inválidos', 
      details: result.error.flatten() 
    }); 
  } 
 
  const task = createTask(result.data); 
 
  res.status(201).json({ 
    data: task 
  }); 
}); 
 
router.patch('/:id', (req, res) => { 
  const result = updateTaskSchema.safeParse(req.body); 
 
  if (!result.success) { 
    return res.status(400).json({ 
      error: 'Datos inválidos', 
      details: result.error.flatten() 
    }); 
  } 
 
  const task = updateTask(req.params.id, result.data);
    if (!task) { 
    return res.status(404).json({ 
      error: 'Tarea no encontrada' 
    }); 
  } 
 
  res.json({ 
    data: task 
  }); 
}); 
 
router.delete('/:id', (req, res) => { 
  const deleted = deleteTask(req.params.id); 
 
  if (!deleted) { 
    return res.status(404).json({ 
      error: 'Tarea no encontrada' 
    }); 
  } 
 
  res.status(204).send(); 
}); 
 
export default router;