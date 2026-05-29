import request from 'supertest'; 
import { describe, expect, it, beforeEach } from 'vitest'; 
import app from '../src/app.js'; 
import { resetTasksForTests } from '../src/services/tasks.service.js'; 
 
beforeEach(() => { 
  resetTasksForTests(); 
}); 
 
describe('API de tareas', () => { 
  it('responde el health check', async () => { 
    const response = await request(app).get('/health'); 
 
    expect(response.status).toBe(200); 
    expect(response.body.status).toBe('ok'); 
  }); 
 
  it('crea una tarea válida', async () => { 
    const response = await request(app) 
      .post('/api/tasks') 
      .send({ title: 'Probar endpoint POST' }); 
 
    expect(response.status).toBe(201); 
    expect(response.body.data).toHaveProperty('id'); 
    expect(response.body.data.title).toBe('Probar endpoint POST'); 
    expect(response.body.data.completed).toBe(false); 
  }); 
 
  it('rechaza una tarea con título muy corto', async () => { 
 
 
 
    const response = await request(app) 
      .post('/api/tasks') 
      .send({ title: 'No' }); 
 
    expect(response.status).toBe(400); 
    expect(response.body.error).toBe('Datos inválidos'); 
  }); 
 
  it('actualiza una tarea existente', async () => { 
    const created = await request(app) 
      .post('/api/tasks') 
      .send({ title: 'Actualizar tarea' }); 
 
    const id = created.body.data.id; 
 
    const response = await request(app) 
      .patch(`/api/tasks/${id}`) 
      .send({ completed: true }); 
 
    expect(response.status).toBe(200); 
    expect(response.body.data.completed).toBe(true); 
  }); 
 
  it('elimina una tarea existente', async () => { 
    const created = await request(app) 
      .post('/api/tasks') 
      .send({ title: 'Eliminar tarea' }); 
 
    const id = created.body.data.id; 
 
    const response = await request(app).delete(`/api/tasks/${id}`); 
 
    expect(response.status).toBe(204); 
  }); 
}); 