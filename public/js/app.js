const API_URL = '/api/netflix';

const form = document.querySelector('#netflixForm');
const messageBox = document.querySelector('#messageBox');
const recordsContainer = document.querySelector('#recordsContainer');
const loadingState = document.querySelector('#loadingState');
const submitBtn = document.querySelector('#submitBtn');
const clearBtn = document.querySelector('#clearBtn');
const reloadBtn = document.querySelector('#reloadBtn');
const reloadHeaderBtn = document.querySelector('#reloadHeaderBtn');
const formTitle = document.querySelector('#formTitle');
const formPanel = document.querySelector('#formPanel');
const registroIdInput = document.querySelector('#registroId');

const campos = [
  'nombreEmpresa',
  'industria',
  'sede',
  'pais',
  'descripcion',
  'sitioWeb',
  'numeroEmpleados',
  'ingresosAnuales',
  'estado',
  'fechaFundacion'
];

const estadosPermitidos = ['Activa', 'Inactiva', 'En expansión', 'En expansion'];
let registrosActuales = [];

document.addEventListener('DOMContentLoaded', () => {
  form.addEventListener('submit', manejarEnvioFormulario);
  clearBtn.addEventListener('click', limpiarFormulario);
  reloadBtn.addEventListener('click', cargarRegistros);
  reloadHeaderBtn.addEventListener('click', cargarRegistros);
  recordsContainer.addEventListener('click', manejarAccionesRegistro);
  cargarRegistros();
});

async function cargarRegistros() {
  cambiarEstadoCarga(true);

  try {
    const respuesta = await solicitar(API_URL);
    registrosActuales = Array.isArray(respuesta.data) ? respuesta.data : [];
    renderizarRegistros(registrosActuales);
    actualizarEstadisticas(registrosActuales);
  } catch (error) {
    mostrarMensaje(error.message, 'error');
    renderizarRegistros([]);
    actualizarEstadisticas([]);
  } finally {
    cambiarEstadoCarga(false);
  }
}

async function crearRegistro(data) {
  return solicitar(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

async function actualizarRegistro(id, data) {
  return solicitar(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

async function eliminarRegistro(id) {
  return solicitar(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
}

function renderizarRegistros(registros) {
  if (!registros.length) {
    recordsContainer.innerHTML = `
      <div class="empty-state">
        No se encontraron registros.
      </div>
    `;
    return;
  }

  recordsContainer.innerHTML = registros.map((registro) => crearTarjetaRegistro(registro)).join('');
}

function llenarFormulario(registro) {
  registroIdInput.value = registro._id || '';

  campos.forEach((campo) => {
    const input = form.elements[campo];
    if (!input) return;

    if (campo === 'fechaFundacion') {
      input.value = normalizarFechaInput(registro[campo]);
      return;
    }

    input.value = campo === 'estado'
      ? normalizarEstadoFormulario(registro[campo])
      : registro[campo] ?? '';
  });

  submitBtn.textContent = 'Actualizar registro';
  formTitle.textContent = 'Editando registro';
  formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function limpiarFormulario() {
  form.reset();
  registroIdInput.value = '';
  form.elements.estado.value = 'Activa';
  submitBtn.textContent = 'Guardar registro';
  formTitle.textContent = 'Nuevo registro';
}

function mostrarMensaje(texto, tipo = 'success') {
  messageBox.textContent = texto;
  messageBox.className = `message-box show ${tipo}`;

  window.clearTimeout(mostrarMensaje.timeoutId);
  mostrarMensaje.timeoutId = window.setTimeout(() => {
    messageBox.className = 'message-box';
    messageBox.textContent = '';
  }, 6500);
}

function obtenerDatosFormulario() {
  return {
    nombreEmpresa: form.elements.nombreEmpresa.value.trim(),
    industria: form.elements.industria.value.trim(),
    sede: form.elements.sede.value.trim(),
    pais: form.elements.pais.value.trim(),
    descripcion: form.elements.descripcion.value.trim(),
    sitioWeb: form.elements.sitioWeb.value.trim(),
    numeroEmpleados: Number(form.elements.numeroEmpleados.value),
    ingresosAnuales: Number(form.elements.ingresosAnuales.value),
    estado: form.elements.estado.value,
    fechaFundacion: form.elements.fechaFundacion.value
  };
}

function validarFormulario(data) {
  const errores = [];

  if (!data.nombreEmpresa) errores.push('El nombre de la empresa es obligatorio.');
  if (!data.industria) errores.push('La industria es obligatoria.');
  if (!data.sede) errores.push('La sede es obligatoria.');
  if (!data.pais) errores.push('El país es obligatorio.');
  if (!data.descripcion) errores.push('La descripción es obligatoria.');
  if (!data.sitioWeb) errores.push('El sitio web es obligatorio.');
  if (!Number.isFinite(data.numeroEmpleados) || data.numeroEmpleados < 0) {
    errores.push('El número de empleados debe ser mayor o igual a 0.');
  }
  if (!Number.isFinite(data.ingresosAnuales) || data.ingresosAnuales < 0) {
    errores.push('Los ingresos anuales deben ser mayores o iguales a 0.');
  }
  if (!estadosPermitidos.includes(data.estado)) {
    errores.push('El estado seleccionado no es válido.');
  }
  if (!data.fechaFundacion || Number.isNaN(Date.parse(data.fechaFundacion))) {
    errores.push('La fecha de fundación es obligatoria y debe ser válida.');
  }

  try {
    new URL(data.sitioWeb);
  } catch {
    errores.push('El sitio web debe ser una URL válida.');
  }

  return errores;
}

async function manejarEnvioFormulario(event) {
  event.preventDefault();
  const data = obtenerDatosFormulario();
  const errores = validarFormulario(data);

  if (errores.length) {
    mostrarMensaje(errores.join(' '), 'error');
    return;
  }

  const id = registroIdInput.value;
  submitBtn.disabled = true;

  try {
    if (id) {
      await actualizarRegistro(id, data);
      mostrarMensaje('Registro actualizado correctamente.', 'success');
    } else {
      await crearRegistro(data);
      mostrarMensaje('Registro creado correctamente.', 'success');
    }

    limpiarFormulario();
    await cargarRegistros();
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
  }
}

async function manejarAccionesRegistro(event) {
  const boton = event.target.closest('button[data-action]');
  if (!boton) return;

  const { action, id } = boton.dataset;
  const registro = registrosActuales.find((item) => item._id === id);

  if (action === 'edit' && registro) {
    llenarFormulario(registro);
    return;
  }

  if (action === 'delete') {
    const confirmado = window.confirm('Confirmar eliminación: ¿Deseas eliminar este registro?');
    if (!confirmado) return;

    boton.disabled = true;

    try {
      await eliminarRegistro(id);
      mostrarMensaje('Registro eliminado correctamente.', 'success');
      await cargarRegistros();
    } catch (error) {
      mostrarMensaje(error.message, 'error');
      boton.disabled = false;
    }
  }
}

async function solicitar(url, opciones = {}) {
  let respuesta;

  try {
    respuesta = await fetch(url, opciones);
  } catch {
    throw new Error('No se puede conectar con el servidor. Verifica que npm start esté activo.');
  }

  const payload = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok || payload.success === false) {
    throw new Error(crearMensajeError(respuesta.status, payload));
  }

  return payload;
}

function crearMensajeError(status, payload) {
  const detalles = extraerDetallesErrores(payload.errors);
  const mensajeBase = payload.message || 'Error inesperado del servidor.';
  const mensaje = detalles ? `${mensajeBase}: ${detalles}` : mensajeBase;

  if (status === 400) return `Solicitud inválida. ${mensaje}`;
  if (status === 404) return `No encontrado. ${mensaje}`;
  if (status >= 500) return `Error interno del servidor. ${mensaje}`;
  return mensaje;
}

function extraerDetallesErrores(errors) {
  if (!errors) return '';
  if (Array.isArray(errors)) return errors.join(' ');
  if (typeof errors === 'object') return Object.values(errors).flat().join(' ');
  return String(errors);
}

function crearTarjetaRegistro(registro) {
  const estadoClase = normalizarClaseEstado(registro.estado);
  const estadoVisible = normalizarEstadoFormulario(registro.estado || 'Sin estado');
  const fecha = formatearFecha(registro.fechaFundacion);
  const empleados = formatearNumero(registro.numeroEmpleados);
  const ingresos = formatearMoneda(registro.ingresosAnuales);
  const sitioWeb = escapeHtml(registro.sitioWeb || '');

  return `
    <article class="record-card">
      <div class="record-top">
        <div>
          <h3>${escapeHtml(registro.nombreEmpresa)}</h3>
          <p class="record-subtitle">${escapeHtml(registro.industria)} · ${escapeHtml(registro.pais)}</p>
        </div>
        <span class="status-badge ${estadoClase}">${escapeHtml(estadoVisible)}</span>
      </div>

      <p class="record-description">${escapeHtml(registro.descripcion)}</p>

      <div class="record-meta">
        <div class="meta-item">
          <span>Sede</span>
          <strong>${escapeHtml(registro.sede)}</strong>
        </div>
        <div class="meta-item">
          <span>Fundación</span>
          <strong>${fecha}</strong>
        </div>
        <div class="meta-item">
          <span>Empleados</span>
          <strong>${empleados}</strong>
        </div>
        <div class="meta-item">
          <span>Ingresos anuales</span>
          <strong>${ingresos}</strong>
        </div>
        <div class="meta-item">
          <span>Sitio web</span>
          <a href="${sitioWeb}" target="_blank" rel="noopener noreferrer">${sitioWeb}</a>
        </div>
      </div>

      <div class="record-actions">
        <button class="btn btn-light btn-sm" type="button" data-action="edit" data-id="${registro._id}">
          Editar
        </button>
        <button class="btn btn-outline-danger btn-sm" type="button" data-action="delete" data-id="${registro._id}">
          Eliminar
        </button>
      </div>
    </article>
  `;
}

function actualizarEstadisticas(registros) {
  const total = registros.length;
  const activas = registros.filter((registro) => registro.estado === 'Activa').length;
  const paises = new Set(registros.map((registro) => registro.pais).filter(Boolean)).size;
  const empleados = registros.reduce((totalEmpleados, registro) => {
    return totalEmpleados + (Number(registro.numeroEmpleados) || 0);
  }, 0);

  document.querySelector('#statTotal').textContent = formatearNumero(total);
  document.querySelector('#statActivas').textContent = formatearNumero(activas);
  document.querySelector('#statPaises').textContent = formatearNumero(paises);
  document.querySelector('#statEmpleados').textContent = formatearNumero(empleados);
}

function cambiarEstadoCarga(estaCargando) {
  loadingState.hidden = !estaCargando;
  reloadBtn.disabled = estaCargando;
  reloadHeaderBtn.disabled = estaCargando;
}

function normalizarFechaInput(valor) {
  if (!valor) return '';
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return '';
  return fecha.toISOString().slice(0, 10);
}

function normalizarEstadoFormulario(estado = '') {
  if (estado === 'En expansion') return 'En expansión';
  return estado;
}

function formatearFecha(valor) {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(fecha);
}

function formatearNumero(valor) {
  return new Intl.NumberFormat('es-CO').format(Number(valor) || 0);
}

function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Number(valor) || 0);
}

function normalizarClaseEstado(estado = '') {
  return estado
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
}

function escapeHtml(valor = '') {
  return String(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
