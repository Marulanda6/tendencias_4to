const API_URL = '/api/personas'; 
 
const form = document.querySelector('#personaForm'); 
 
 
const tableBody = document.querySelector('#personasTableBody'); 
const messageBox = document.querySelector('#messageBox'); 
const submitButton = document.querySelector('#submitButton'); 
const formTitle = document.querySelector('#formTitle'); 
const cancelEditButton = document.querySelector('#cancelEditButton'); 
const cityFilter = document.querySelector('#cityFilter'); 
const filterButton = document.querySelector('#filterButton'); 
const clearFilterButton = document.querySelector('#clearFilterButton'); 
const statusText = document.querySelector('#statusText'); 
const statusDot = document.querySelector('.status-dot'); 
 
let editingCedula = null; 
 
function showMessage(text, type = '') { 
  messageBox.textContent = text; 
  messageBox.className = `message ${type}`; 
} 
 
function getFormData() { 
  const data = new FormData(form); 
 
  return { 
    cedula: data.get('cedula').trim(), 
    apellidos: data.get('apellidos').trim(), 
    nombres: data.get('nombres').trim(), 
    fechaNacimiento: data.get('fechaNacimiento'), 
    direccion: data.get('direccion').trim(), 
    ciudad: data.get('ciudad').trim() 
  }; 
} 
 
function fillForm(persona) { 
  form.cedula.value = persona.cedula; 
  form.apellidos.value = persona.apellidos; 
  form.nombres.value = persona.nombres; 
  form.fechaNacimiento.value = persona.fechaNacimiento.substring(0, 10); 
  form.direccion.value = persona.direccion; 
  form.ciudad.value = persona.ciudad; 
 
  editingCedula = persona.cedula; 
  form.cedula.disabled = true; 
  formTitle.textContent = 'Editar persona'; 
  submitButton.textContent = 'Actualizar persona'; 
  cancelEditButton.hidden = false; 
} 
 
function resetForm() { 
  form.reset(); 
  editingCedula = null; 
  form.cedula.disabled = false; 
  formTitle.textContent = 'Registrar persona'; 
  submitButton.textContent = 'Guardar persona'; 
  cancelEditButton.hidden = true; 
} 
 
function renderPersonas(personas) { 
  if (!personas.length) { 
    tableBody.innerHTML = ` 
      <tr> 
        <td colspan="5" class="empty-state"> 
          No hay personas registradas con los filtros actuales. 
        </td> 
      </tr> 
    `; 
 
 
    return; 
  } 
 
  tableBody.innerHTML = personas.map((persona) => ` 
    <tr> 
      <td>${persona.cedula}</td> 
      <td> 
        <div class="row-title">${persona.apellidos}</div> 
        <div class="row-subtitle">${persona.nombres}</div> 
      </td> 
      <td>${persona.fechaNacimiento.substring(0, 10)}</td> 
      <td>${persona.ciudad}</td> 
      <td> 
        <div class="actions"> 
          <button class="secondary-button" data-action="edit" data-cedula="${persona.cedula}"> 
            Editar 
          </button> 
          <button class="danger-button" data-action="delete" data-cedula="${persona.cedula}"> 
            Eliminar 
          </button> 
        </div> 
      </td> 
    </tr> 
  `).join(''); 
} 
 
async function checkHealth() { 
  try { 
    const response = await fetch('/health'); 
    const result = await response.json(); 
 
    if (!response.ok) { 
      throw new Error(result.message || 'Servicio no disponible'); 
    } 
 
    statusText.textContent = 'API y MySQL conectados'; 
    statusDot.classList.remove('error'); 
  } catch (error) { 
    statusText.textContent = 'No se pudo conectar con MySQL'; 
    statusDot.classList.add('error'); 
  } 
} 
 
async function loadPersonas() { 
  const ciudad = cityFilter.value.trim(); 
  const url = ciudad ? `${API_URL}?ciudad=${encodeURIComponent(ciudad)}` : API_URL; 
 
  const response = await fetch(url); 
  const result = await response.json(); 
 
  if (!response.ok) { 
    throw new Error(result.error || 'No se pudo cargar la lista'); 
  } 
 
  renderPersonas(result.data); 
} 
 
async function savePersona(event) { 
  event.preventDefault(); 
 
  const data = getFormData(); 
  const url = editingCedula ? `${API_URL}/${editingCedula}` : API_URL; 
  const method = editingCedula ? 'PATCH' : 'POST'; 
 
 
 
  const payload = editingCedula 
    ? { 
        apellidos: data.apellidos, 
        nombres: data.nombres, 
        fechaNacimiento: data.fechaNacimiento, 
        direccion: data.direccion, 
        ciudad: data.ciudad 
      } 
    : data; 
 
  const response = await fetch(url, { 
    method, 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(payload) 
  }); 
 
  const result = response.status === 204 ? {} : await response.json(); 
 
  if (!response.ok) { 
    throw new Error(result.error || 'No se pudo guardar el registro'); 
  } 
 
  showMessage( 
    editingCedula ? 'Persona actualizada correctamente.' : 'Persona registrada correctamente.', 
    'success' 
  ); 
  resetForm(); 
  await loadPersonas(); 
} 
 
async function deletePersona(cedula) { 
  const confirmed = confirm(`¿Desea eliminar la persona con cédula ${cedula}?`); 
 
  if (!confirmed) { 
    return; 
  } 
 
  const response = await fetch(`${API_URL}/${cedula}`, { 
    method: 'DELETE' 
  }); 
 
  if (!response.ok) { 
    const result = await response.json(); 
    throw new Error(result.error || 'No se pudo eliminar el registro'); 
  } 
 
  showMessage('Persona eliminada correctamente.', 'success'); 
  await loadPersonas(); 
} 
 
tableBody.addEventListener('click', async (event) => { 
  const button = event.target.closest('button'); 
 
  if (!button) { 
    return; 
  } 
 
  const { action, cedula } = button.dataset; 
 
  try { 
    if (action === 'edit') { 
      const response = await fetch(`${API_URL}/${cedula}`); 
      const result = await response.json(); 
      fillForm(result.data); 
 
 
      showMessage('Editando registro seleccionado.'); 
    } 
 
    if (action === 'delete') { 
      await deletePersona(cedula); 
    } 
  } catch (error) { 
    showMessage(error.message, 'error'); 
  } 
}); 
 
form.addEventListener('submit', async (event) => { 
  try { 
    await savePersona(event); 
  } catch (error) { 
    showMessage(error.message, 'error'); 
  } 
}); 
 
cancelEditButton.addEventListener('click', () => { 
  resetForm(); 
  showMessage('Edición cancelada.'); 
}); 
 
filterButton.addEventListener('click', async () => { 
  try { 
    await loadPersonas(); 
  } catch (error) { 
    showMessage(error.message, 'error'); 
  } 
}); 
 
clearFilterButton.addEventListener('click', async () => { 
  cityFilter.value = ''; 
  await loadPersonas(); 
}); 
 
checkHealth(); 
loadPersonas().catch((error) => showMessage(error.message, 'error'));