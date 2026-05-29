import crypto from 'node:crypto'; 
 
const tasks = [ 
  { 
    id: crypto.randomUUID(), 
    title: 'Preparar entorno de desarrollo', 
    completed: false, 
    createdAt: new Date().toISOString() 
  } 
]; 
 
export function findAllTasks() { 
  return tasks; 
} 
 
export function findTaskById(id) { 
  return tasks.find((task) => task.id === id); 
} 
 
export function createTask(data) { 
  const task = { 
    id: crypto.randomUUID(), 
    title: data.title, 
    completed: false, 
    createdAt: new Date().toISOString() 
  }; 
 
  tasks.push(task); 
  return task; 
} 
 
export function updateTask(id, data) { 
  const task = findTaskById(id);
   if (!task) { 
    return null; 
  } 
 
  if (data.title !== undefined) { 
    task.title = data.title; 
  } 
 
  if (data.completed !== undefined) { 
    task.completed = data.completed; 
  } 
 
  task.updatedAt = new Date().toISOString(); 
  return task; 
} 
 
export function deleteTask(id) { 
  const index = tasks.findIndex((task) => task.id === id); 
 
  if (index === -1) { 
    return false; 
  } 
 
  tasks.splice(index, 1); 
  return true; 
} 
 
export function resetTasksForTests() { 
  tasks.splice(0, tasks.length); 
}