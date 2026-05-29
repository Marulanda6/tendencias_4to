export const openApiSpec = { 
  openapi: '3.0.3', 
  info: { 
    title: 'Laboratorio Web Service REST', 
    version: '1.0.0', 
    description: 'API local para gestionar tareas durante una práctica guiada.' 
  }, 
  servers: [ 
    { 
      url: 'http://localhost:3000', 
      description: 'Servidor local' 
    } 
  ], 
  paths: { 
    '/health': { 
      get: { 
        summary: 'Verifica el estado del servicio', 
        responses: { 
          200: { 
            description: 'Servicio disponible' 
          } 
        } 
      } 
 }, 
    '/api/tasks': { 
      get: { 
        summary: 'Lista todas las tareas', 
        responses: { 
          200: { 
            description: 'Listado de tareas' 
          } 
        } 
      }, 
      post: { 
        summary: 'Crea una nueva tarea', 
        requestBody: { 
          required: true, 
          content: { 
            'application/json': { 
              schema: { 
                type: 'object', 
                required: ['title'], 
                properties: { 
                  title: { 
                    type: 'string', 
                    example: 'Estudiar Express 5' 
                  } 
                } 
              } 
            } 
          } 
        }, 
        responses: { 
          201: { 
            description: 'Tarea creada' 
          }, 
          400: { 
            description: 'Datos inválidos' 
          } 
        } 
      } 
    }, 
    '/api/tasks/{id}': { 
      get: { 
        summary: 'Obtiene una tarea por ID', 
        parameters: [ 
          { 
            name: 'id', 
            in: 'path', 
            required: true, 
            schema: { 
              type: 'string' 
            } 
          } 
        ], 
        responses: { 
          200: { 
            description: 'Tarea encontrada' 
          }, 
          404: { 
 description: 'Tarea no encontrada' 
          } 
        } 
      }, 
      patch: { 
        summary: 'Actualiza parcialmente una tarea', 
        parameters: [ 
          { 
            name: 'id', 
            in: 'path', 
            required: true, 
            schema: { 
              type: 'string' 
            } 
          } 
        ], 
        requestBody: { 
          required: true, 
          content: { 
            'application/json': { 
              schema: { 
                type: 'object', 
                properties: { 
                  title: { 
                    type: 'string', 
                    example: 'Estudiar pruebas automatizadas' 
                  }, 
                  completed: { 
                    type: 'boolean', 
                    example: true 
                  } 
                } 
              } 
            } 
          } 
        }, 
        responses: { 
          200: { 
            description: 'Tarea actualizada' 
          }, 
          400: { 
            description: 'Datos inválidos' 
          }, 
          404: { 
            description: 'Tarea no encontrada' 
          } 
        } 
      }, 
      delete: { 
        summary: 'Elimina una tarea', 
        parameters: [ 
          { 
            name: 'id', 
            in: 'path', 
            required: true, 
            schema: { 
              type: 'string'
                } 
          } 
        ], 
        responses: { 
          204: { 
            description: 'Tarea eliminada' 
          }, 
          404: { 
            description: 'Tarea no encontrada' 
          } 
        } 
      } 
    } 
  } 
}; 