import express from 'express'; 
import cors from 'cors'; 
import helmet from 'helmet'; 
import morgan from 'morgan'; 
import swaggerUi from 'swagger-ui-express'; 
import personasRouter from './routes/personas.routes.js'; 
import { openApiSpec } from './docs/openapi.js'; 
import { checkDatabaseConnection } from './config/database.js'; 
 
const app = express(); 
 
app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 
app.use(morgan('dev')); 
 
// Sirve la interfaz web ubicada en la carpeta public. 
app.use(express.static('public')); 
 
app.get('/health', async (req, res) => { 
  try { 
    await checkDatabaseConnection(); 
    res.json({ 
      status: 'ok', 
      database: 'connected', 
      service: 'lab-crud-personas-mysql', 
      timestamp: new Date().toISOString() 
    }); 
  } catch (error) { 
    res.status(503).json({ 
      status: 'error', 
      database: 'disconnected', 
      message: error.message 
    }); 
  } 
}); 
 
app.use('/api/personas', personasRouter); 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec)); 

export default app;