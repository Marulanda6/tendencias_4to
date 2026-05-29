import express from 'express'; 
import cors from 'cors'; 
import helmet from 'helmet'; 
import morgan from 'morgan'; 
import swaggerUi from 'swagger-ui-express'; 
import tasksRouter from './routes/tasks.routes.js'; 
import { openApiSpec } from './docs/openapi.js'; 
 
const app = express(); 
 
app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 
app.use(morgan('dev')); 
 
app.get('/health', (req, res) => { 
  res.json({ 
    status: 'ok', 
    service: 'lab-web-service-local', 
    timestamp: new Date().toISOString() 
  }); 
}); 
 
app.use('/api/tasks', tasksRouter); 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec)); 
 
app.use((req, res) => { 
  res.status(404).json({ 
    error: 'Ruta no encontrada' 
  }); 
}); 
 
app.use((error, req, res, next) => {
      console.error(error); 
  res.status(500).json({ 
    error: 'Error interno del servidor' 
  }); 
}); 
 
export default app;