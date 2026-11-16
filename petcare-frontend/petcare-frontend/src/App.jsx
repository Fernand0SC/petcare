import { useEffect, useState } from 'react';
import {
  getDuenos,
  createDueno,
  getMascotasByDueno,
  createMascota,
  getCitasByMascota,
  createCita,
} from './services/api';
import './App.css';

export default function App() {
  // Estados principales
  const [duenos, setDuenos] = useState([]);
  const [selectedDueno, setSelectedDueno] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [citas, setCitas] = useState([]);

  // Estados de interfaz
  const [loadingDuenos, setLoadingDuenos] = useState(false);
  const [loadingMascotas, setLoadingMascotas] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mostrar/ocultar formularios auxiliares
  const [showNewDueno, setShowNewDueno] = useState(false);
  const [showNewMascota, setShowNewMascota] = useState(false);

  // Formularios
  const [duenoForm, setDuenoForm] = useState({
    rut: '',
    nombre: '',
    telefono: '',
    email: '',
  });

  const [mascotaForm, setMascotaForm] = useState({
    nombre: '',
    especie: 'Perro',
    raza: '',
    fechaNacimiento: '',
  });

  const [citaForm, setCitaForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    motivo: '',
    diagnostico: '',
    costo: '',
  });

  // Cargar dueños al iniciar
  useEffect(() => {
    cargarDuenos();
  }, []);

  async function cargarDuenos() {
    setLoadingDuenos(true);
    setError('');
    try {
      const data = await getDuenos();
      setDuenos(data);
    } catch (err) {
      setError(`No se pudieron cargar los dueños: ${err.message}`);
    } finally {
      setLoadingDuenos(false);
    }
  }

  async function handleSelectDueno(dueno) {
    setSelectedDueno(dueno);
    setSelectedMascota(null);
    setCitas([]);
    setShowNewMascota(false);
    setLoadingMascotas(true);
    setError('');
    try {
      const data = await getMascotasByDueno(dueno.id);
      setMascotas(data);
    } catch (err) {
      setError(`Error al cargar mascotas: ${err.message}`);
    } finally {
      setLoadingMascotas(false);
    }
  }

  async function handleSelectMascota(mascota) {
    setSelectedMascota(mascota);
    setError('');
    try {
      const data = await getCitasByMascota(mascota.id);
      setCitas(data);
    } catch (err) {
      setError(`Error al cargar citas: ${err.message}`);
    }
  }

  async function handleCrearDueno(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const creado = await createDueno(duenoForm);
      setDuenos((prev) => [...prev, creado]);
      setDuenoForm({ rut: '', nombre: '', telefono: '', email: '' });
      setShowNewDueno(false);
      setSuccess(`Dueño "${creado.nombre}" registrado correctamente.`);
      handleSelectDueno(creado);
    } catch (err) {
      setError(`Error al registrar dueño: ${err.message}`);
    }
  }

  async function handleCrearMascota(e) {
    e.preventDefault();
    if (!selectedDueno) return;
    setError('');
    setSuccess('');
    try {
      // El backend espera { ..., dueno: { id } }
      const payload = {
        ...mascotaForm,
        dueno: { id: selectedDueno.id },
      };
      const creada = await createMascota(payload);
      setMascotas((prev) => [...prev, creada]);
      setMascotaForm({ nombre: '', especie: 'Perro', raza: '', fechaNacimiento: '' });
      setShowNewMascota(false);
      setSuccess(`Mascota "${creada.nombre}" registrada para ${selectedDueno.nombre}.`);
      handleSelectMascota(creada);
    } catch (err) {
      setError(`Error al registrar mascota: ${err.message}`);
    }
  }

  async function handleRegistrarCita(e) {
    e.preventDefault();
    if (!selectedMascota) {
      setError('Selecciona primero una mascota para agendar la cita.');
      return;
    }
    setError('');
    setSuccess('');
    try {
      // El backend Cita.java espera { fecha, motivo, diagnostico, costo, mascota: { id } }
      const payload = {
        fecha: citaForm.fecha,
        motivo: citaForm.motivo,
        diagnostico: citaForm.diagnostico,
        costo: Number(citaForm.costo),
        mascota: { id: selectedMascota.id },
      };
      const nuevaCita = await createCita(payload);
      setCitas((prev) => [...prev, nuevaCita]);
      setCitaForm({
        fecha: new Date().toISOString().split('T')[0],
        motivo: '',
        diagnostico: '',
        costo: '',
      });
      setSuccess(`Cita registrada exitosamente para ${selectedMascota.nombre}.`);
    } catch (err) {
      setError(`Error al registrar cita: ${err.message}`);
    }
  }

  return (
    <div className="app-container">
      <header className="topbar">
        <div>
          <h1>PetCare — Gestión Veterinaria</h1>
          <p>Panel conectado a Spring Boot REST API</p>
        </div>
        <span className="badge-api">API: /api/duenos · /api/mascotas · /api/citas</span>
      </header>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>{success}</span>
          <button onClick={() => setSuccess('')}>✕</button>
        </div>
      )}

      <main className="grid-layout">
        {/* COLUMNA 1: DUEÑOS */}
        <section className="card">
          <div className="card-header">
            <h2>1. Dueños ({duenos.length})</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowNewDueno(!showNewDueno)}
            >
              {showNewDueno ? 'Cancelar' : '+ Nuevo'}
            </button>
          </div>

          {showNewDueno && (
            <form className="form-box" onSubmit={handleCrearDueno}>
              <div className="form-group">
                <label>RUT</label>
                <input
                  required
                  placeholder="12.345.678-9"
                  value={duenoForm.rut}
                  onChange={(e) => setDuenoForm({ ...duenoForm, rut: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Nombre completo</label>
                <input
                  required
                  placeholder="Ana Pérez"
                  value={duenoForm.nombre}
                  onChange={(e) => setDuenoForm({ ...duenoForm, nombre: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  required
                  placeholder="+56 9 1234 5678"
                  value={duenoForm.telefono}
                  onChange={(e) => setDuenoForm({ ...duenoForm, telefono: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  placeholder="ana@correo.cl"
                  value={duenoForm.email}
                  onChange={(e) => setDuenoForm({ ...duenoForm, email: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Guardar Dueño
              </button>
            </form>
          )}

          {loadingDuenos ? (
            <p className="empty-state">Cargando dueños...</p>
          ) : duenos.length === 0 ? (
            <p className="empty-state">
              No hay dueños registrados. Haz clic en <strong>+ Nuevo</strong> para crear uno.
            </p>
          ) : (
            <div className="list">
              {duenos.map((d) => (
                <div
                  key={d.id}
                  className={`list-item ${selectedDueno?.id === d.id ? 'active' : ''}`}
                  onClick={() => handleSelectDueno(d)}
                >
                  <div className="list-item-title">{d.nombre}</div>
                  <div className="list-item-sub">RUT: {d.rut} · Tel: {d.telefono}</div>
                  <div className="list-item-sub">{d.email}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* COLUMNA 2: MASCOTAS DEL DUEÑO SELECCIONADO */}
        <section className="card">
          <div className="card-header">
            <h2>
              2. Mascotas {selectedDueno ? `de ${selectedDueno.nombre}` : ''}
            </h2>
            {selectedDueno && (
              <button
                className="btn btn-primary"
                onClick={() => setShowNewMascota(!showNewMascota)}
              >
                {showNewMascota ? 'Cancelar' : '+ Mascota'}
              </button>
            )}
          </div>

          {!selectedDueno ? (
            <p className="empty-state">
              Selecciona un dueño en la primera columna para ver sus mascotas.
            </p>
          ) : (
            <>
              {showNewMascota && (
                <form className="form-box" onSubmit={handleCrearMascota}>
                  <div className="form-group">
                    <label>Nombre de la mascota</label>
                    <input
                      required
                      placeholder="Firulais"
                      value={mascotaForm.nombre}
                      onChange={(e) =>
                        setMascotaForm({ ...mascotaForm, nombre: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Especie</label>
                    <select
                      value={mascotaForm.especie}
                      onChange={(e) =>
                        setMascotaForm({ ...mascotaForm, especie: e.target.value })
                      }
                    >
                      <option value="Perro">Perro</option>
                      <option value="Gato">Gato</option>
                      <option value="Ave">Ave</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Raza</label>
                    <input
                      required
                      placeholder="Quiltro / Mestizo"
                      value={mascotaForm.raza}
                      onChange={(e) =>
                        setMascotaForm({ ...mascotaForm, raza: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha de nacimiento</label>
                    <input
                      type="date"
                      required
                      value={mascotaForm.fechaNacimiento}
                      onChange={(e) =>
                        setMascotaForm({ ...mascotaForm, fechaNacimiento: e.target.value })
                      }
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Guardar Mascota
                  </button>
                </form>
              )}

              {loadingMascotas ? (
                <p className="empty-state">Cargando mascotas...</p>
              ) : mascotas.length === 0 ? (
                <p className="empty-state">
                  Este dueño no tiene mascotas registradas aún.
                </p>
              ) : (
                <div className="list">
                  {mascotas.map((m) => (
                    <div
                      key={m.id}
                      className={`list-item ${selectedMascota?.id === m.id ? 'active' : ''}`}
                      onClick={() => handleSelectMascota(m)}
                    >
                      <div className="list-item-title">
                        {m.nombre} ({m.especie})
                      </div>
                      <div className="list-item-sub">Raza: {m.raza}</div>
                      <div className="list-item-sub">
                        Nacimiento: {m.fechaNacimiento || 'No registrada'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* COLUMNA 3: REGISTRAR CITA + HISTORIAL */}
        <section className="card">
          <div className="card-header">
            <h2>
              3. Registrar Cita {selectedMascota ? `— ${selectedMascota.nombre}` : ''}
            </h2>
          </div>

          {!selectedMascota ? (
            <p className="empty-state">
              Selecciona una mascota para agendar una cita médica y revisar su historial.
            </p>
          ) : (
            <>
              <form className="form-box" onSubmit={handleRegistrarCita}>
                <div className="form-group">
                  <label>Fecha de atención</label>
                  <input
                    type="date"
                    required
                    value={citaForm.fecha}
                    onChange={(e) => setCitaForm({ ...citaForm, fecha: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Motivo de consulta</label>
                  <input
                    required
                    placeholder="Control anual / Vacunación"
                    value={citaForm.motivo}
                    onChange={(e) => setCitaForm({ ...citaForm, motivo: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Diagnóstico</label>
                  <textarea
                    rows="2"
                    required
                    placeholder="Paciente sano, se aplica vacuna séxtuple"
                    value={citaForm.diagnostico}
                    onChange={(e) =>
                      setCitaForm({ ...citaForm, diagnostico: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Costo ($ CLP)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    placeholder="25000"
                    value={citaForm.costo}
                    onChange={(e) => setCitaForm({ ...citaForm, costo: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Registrar Cita
                </button>
              </form>

              <div>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  Historial de Citas ({citas.length})
                </h3>
                {citas.length === 0 ? (
                  <p className="empty-state" style={{ padding: '0.75rem' }}>
                    Sin citas registradas para {selectedMascota.nombre}.
                  </p>
                ) : (
                  citas.map((c) => (
                    <div key={c.id} className="cita-card">
                      <div className="cita-header">
                        <span>{c.fecha}</span>
                        <span>${Number(c.costo).toLocaleString('es-CL')}</span>
                      </div>
                      <div className="cita-body">
                        <strong>Motivo:</strong> {c.motivo}
                      </div>
                      <div className="cita-body">
                        <strong>Diagnóstico:</strong> {c.diagnostico}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
