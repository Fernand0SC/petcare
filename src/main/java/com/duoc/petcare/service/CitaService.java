package com.duoc.petcare.service;

import com.duoc.petcare.entity.Cita;
import com.duoc.petcare.entity.Mascota;
import com.duoc.petcare.repository.CitaRepository;
import com.duoc.petcare.repository.MascotaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CitaService {

    private final CitaRepository citaRepository;
    private final MascotaRepository mascotaRepository;

    public CitaService(CitaRepository citaRepository, MascotaRepository mascotaRepository) {
        this.citaRepository = citaRepository;
        this.mascotaRepository = mascotaRepository;
    }

    public List<Cita> getAll() {
        return citaRepository.findAll();
    }

    public Cita getById(Long id) {
        return citaRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe una cita con id " + id));
    }

    public Cita create(Cita cita) {
        cita.setId(null);
        cita.setMascota(buscarMascota(cita));
        return citaRepository.save(cita);
    }

    public Cita update(Long id, Cita datos) {
        Cita existente = getById(id);

        existente.setFecha(datos.getFecha());
        existente.setMotivo(datos.getMotivo());
        existente.setDiagnostico(datos.getDiagnostico());
        existente.setCosto(datos.getCosto());
        existente.setMascota(buscarMascota(datos));
        return citaRepository.save(existente);
    }

    public void delete(Long id) {
        citaRepository.delete(getById(id));
    }

    // Validacion: no crear una cita para una mascota inexistente
    private Mascota buscarMascota(Cita cita) {
        if (cita.getMascota() == null || cita.getMascota().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe indicar la mascota");
        }
        Long mascotaId = cita.getMascota().getId();
        return mascotaRepository.findById(mascotaId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe una mascota con id " + mascotaId));
    }
}
