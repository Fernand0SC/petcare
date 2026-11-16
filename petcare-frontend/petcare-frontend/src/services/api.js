const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `Error ${response.status}`;
    try {
      const data = await response.json();
      errorMessage = data.message || data.error || errorMessage;
    } catch {
      // Sin cuerpo JSON
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// --- DUEÑOS ---
export const getDuenos = () => request('/duenos');

export const createDueno = (dueno) =>
  request('/duenos', {
    method: 'POST',
    body: JSON.stringify(dueno),
  });

export const getMascotasByDueno = (duenoId) =>
  request(`/duenos/${duenoId}/mascotas`);

// --- MASCOTAS ---
export const getMascotas = () => request('/mascotas');

export const createMascota = (mascota) =>
  request('/mascotas', {
    method: 'POST',
    body: JSON.stringify(mascota),
  });

export const getCitasByMascota = (mascotaId) =>
  request(`/mascotas/${mascotaId}/citas`);

// --- CITAS ---
export const getCitas = () => request('/citas');

export const createCita = (cita) =>
  request('/citas', {
    method: 'POST',
    body: JSON.stringify(cita),
  });
