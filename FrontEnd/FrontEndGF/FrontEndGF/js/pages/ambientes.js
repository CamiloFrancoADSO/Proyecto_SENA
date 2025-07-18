import { ambienteService } from '../api/ambiente.service.js';

// --- FUNCIONES DE VISTA (Generación de HTML) ---

function createAmbienteRow(ambiente) {
  const statusBadge = ambiente.estado
    ? `<span class="badge bg-gradient-success">Activo</span>`
    : `<span class="badge bg-gradient-secondary">Inactivo</span>`;

  return `
    <tr>
      <td>
        <div class="d-flex px-2 py-1">
          <div>
            <div class="avatar avatar-sm me-3 border-radius-lg bg-gradient-info d-flex align-items-center justify-content-center">
              <i class="material-icons text-white text-sm">meeting_room</i>
            </div>
          </div>
          <div class="d-flex flex-column justify-content-center">
            <h6 class="mb-0 text-sm">${ambiente.nombre_ambiente}</h6>
            <p class="text-xs text-secondary mb-0">ID: ${ambiente.id_ambiente}</p>
          </div>
        </div>
      </td>
      <td>
        <div class="d-flex flex-column justify-content-center">
          <h6 class="mb-0 text-sm">${ambiente.ubicacion}</h6>
        </div>
      </td>
      <td class="align-middle text-center">
        <span class="badge bg-gradient-warning">${ambiente.num_max_aprendices} estudiantes</span>
      </td>
      <td class="align-middle text-center">
        <span class="text-secondary text-xs font-weight-bold">${ambiente.municipio}</span>
      </td>
      <td class="align-middle text-center">
        ${statusBadge}
      </td>
    </tr>
  `;
}

// --- FUNCIONES DE INFORMACIÓN DEL USUARIO ---

function displayCentroInfo() {
  try {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      const centroNombre = document.getElementById('centro-nombre');
      
      if (centroNombre && user.cod_centro) {
        // Obtener el nombre del centro del usuario si está disponible
        centroNombre.textContent = `Centro ${user.cod_centro}`;
        console.log('ℹ️ Mostrando información del centro:', user.cod_centro);
      }
    }
  } catch (error) {
    console.error('❌ Error al obtener información del centro:', error);
  }
}

// --- FUNCIONES DE CARGA DE DATOS ---

async function loadAmbientes() {
  console.log('🔄 Iniciando carga de ambientes...');
  
  const loadingSpinner = document.getElementById('loading-spinner');
  const errorMessage = document.getElementById('error-message');
  const tableContainer = document.getElementById('ambientes-table-container');
  const noDataMessage = document.getElementById('no-data-message');
  const tableBody = document.getElementById('ambientes-table-body');

  // Verificar que los elementos existen
  console.log('📋 Elementos DOM encontrados:', {
    loadingSpinner: !!loadingSpinner,
    errorMessage: !!errorMessage,
    tableContainer: !!tableContainer,
    noDataMessage: !!noDataMessage,
    tableBody: !!tableBody
  });

  try {
    // Mostrar indicador de carga
    loadingSpinner.style.display = 'block';
    errorMessage.style.display = 'none';
    tableContainer.style.display = 'none';
    noDataMessage.style.display = 'none';

    console.log('🚀 Llamando a ambienteService.getAmbientesByCentro()...');
    
    // Obtener ambientes desde la API
    const ambientes = await ambienteService.getAmbientesByCentro();
    
    console.log('✅ Respuesta recibida:', ambientes);
    console.log('📊 Número de ambientes:', ambientes ? ambientes.length : 'ambientes es null/undefined');

    // Ocultar indicador de carga
    loadingSpinner.style.display = 'none';

    if (ambientes && ambientes.length > 0) {
      console.log('📝 Generando filas de tabla...');
      // Mostrar tabla con datos
      tableBody.innerHTML = ambientes.map(createAmbienteRow).join('');
      tableContainer.style.display = 'block';
      console.log('✅ Tabla mostrada con', ambientes.length, 'ambientes');
    } else {
      console.log('⚠️ No hay ambientes para mostrar');
      // Mostrar mensaje de sin datos
      noDataMessage.style.display = 'block';
    }

  } catch (error) {
    console.error('❌ Error al cargar ambientes:', error);
    console.error('❌ Stack trace:', error.stack);
    
    // Ocultar indicador de carga y mostrar error
    loadingSpinner.style.display = 'none';
    errorMessage.style.display = 'block';
    document.getElementById('error-text').textContent = error.message || 'Error al cargar los ambientes de formación';
  }
}

// --- FUNCIONES DE MODAL Y FORMULARIO ---

function resetForm() {
  const form = document.getElementById('create-ambiente-form');
  form.reset();
  
  // Restaurar estado por defecto (activo)
  const estadoCheckbox = document.getElementById('estado');
  const estadoLabel = document.getElementById('estado-label');
  estadoCheckbox.checked = true;
  estadoLabel.textContent = 'Activo';
  
  // Limpiar mensaje de error
  const errorMessage = document.getElementById('modal-error-message');
  errorMessage.style.display = 'none';
  
  // Restaurar botón de envío
  const submitBtn = document.getElementById('btn-submit-ambiente');
  const submitText = document.getElementById('submit-text');
  const submitLoading = document.getElementById('submit-loading');
  
  submitBtn.disabled = false;
  submitText.textContent = 'Crear Ambiente';
  submitLoading.style.display = 'none';

  // Mostrar información del centro en el modal
  displayModalCentroInfo();
}

function displayModalCentroInfo() {
  try {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      const modalCentroInfo = document.getElementById('modal-centro-info');
      
      if (modalCentroInfo && user.cod_centro) {
        modalCentroInfo.textContent = `Centro ${user.cod_centro} - Se asignará automáticamente`;
      }
    }
  } catch (error) {
    console.error('❌ Error al obtener información del centro para el modal:', error);
  }
}

function handleEstadoChange() {
  const estadoCheckbox = document.getElementById('estado');
  const estadoLabel = document.getElementById('estado-label');
  
  if (estadoCheckbox.checked) {
    estadoLabel.textContent = 'Activo';
  } else {
    estadoLabel.textContent = 'Inactivo';
  }
}

function showModalError(message) {
  const errorMessage = document.getElementById('modal-error-message');
  const errorText = document.getElementById('modal-error-text');
  
  errorText.textContent = message;
  errorMessage.style.display = 'block';
}

function setSubmitLoading(isLoading) {
  const submitBtn = document.getElementById('btn-submit-ambiente');
  const submitText = document.getElementById('submit-text');
  const submitLoading = document.getElementById('submit-loading');
  
  if (isLoading) {
    submitBtn.disabled = true;
    submitText.textContent = 'Creando...';
    submitLoading.style.display = 'inline-block';
  } else {
    submitBtn.disabled = false;
    submitText.textContent = 'Crear Ambiente';
    submitLoading.style.display = 'none';
  }
}

async function handleCreateSubmit(event) {
  event.preventDefault();
  
  console.log('📝 Procesando formulario de creación de ambiente...');
  
  // Limpiar errores previos
  const errorMessage = document.getElementById('modal-error-message');
  errorMessage.style.display = 'none';
  
  // Mostrar loading
  setSubmitLoading(true);
  
  try {
    // Obtener datos del formulario
    const formData = new FormData(event.target);
    const ambienteData = {
      nombre_ambiente: formData.get('nombre_ambiente').trim(),
      num_max_aprendices: parseInt(formData.get('num_max_aprendices')),
      municipio: formData.get('municipio').trim(),
      ubicacion: formData.get('ubicacion').trim(),
      estado: formData.has('estado') // checkbox está marcado
    };
    
    console.log('📊 Datos del ambiente a crear:', ambienteData);
    
    // Validaciones básicas
    if (!ambienteData.nombre_ambiente || ambienteData.nombre_ambiente.length < 3) {
      throw new Error('El nombre del ambiente debe tener al menos 3 caracteres');
    }
    
    if (!ambienteData.num_max_aprendices || ambienteData.num_max_aprendices < 1 || ambienteData.num_max_aprendices > 100) {
      throw new Error('La capacidad máxima debe estar entre 1 y 100 aprendices');
    }
    
    if (!ambienteData.municipio || ambienteData.municipio.length < 3) {
      throw new Error('El municipio debe tener al menos 3 caracteres');
    }
    
    if (!ambienteData.ubicacion || ambienteData.ubicacion.length < 10) {
      throw new Error('La ubicación debe tener al menos 10 caracteres');
    }
    
    // Crear el ambiente
    const response = await ambienteService.createAmbiente(ambienteData);
    
    console.log('✅ Ambiente creado exitosamente:', response);
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('create-ambiente-modal'));
    modal.hide();
    
    // Mostrar mensaje de éxito
    console.log('🎉 ¡Ambiente creado exitosamente!');
    
    // Recargar la tabla de ambientes
    await loadAmbientes();
    
  } catch (error) {
    console.error('❌ Error al crear ambiente:', error);
    showModalError(error.message || 'Error al crear el ambiente');
  } finally {
    setSubmitLoading(false);
  }
}

function setupEventListeners() {
  // Listener para el formulario de creación
  const createForm = document.getElementById('create-ambiente-form');
  if (createForm) {
    createForm.removeEventListener('submit', handleCreateSubmit);
    createForm.addEventListener('submit', handleCreateSubmit);
  }
  
  // Listener para limpiar el formulario al abrir el modal de creación
  const createModal = document.getElementById('create-ambiente-modal');
  if (createModal) {
    createModal.addEventListener('show.bs.modal', resetForm);
  }

  // Listener para el switch de estado
  const estadoCheckbox = document.getElementById('estado');
  if (estadoCheckbox) {
    estadoCheckbox.removeEventListener('change', handleEstadoChange);
    estadoCheckbox.addEventListener('change', handleEstadoChange);
  }
  
  console.log('🔗 Event listeners de modales configurados');
}

// --- INICIALIZACIÓN ---

function init() {
  console.log('🚀 Inicializando módulo de ambientes...');
  displayCentroInfo();
  loadAmbientes();
  setupEventListeners();
}

export { init }; 