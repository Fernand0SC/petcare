package com.duoc.petcare.service;

import com.duoc.petcare.entity.Cita;
import com.duoc.petcare.entity.Dueno;
import com.duoc.petcare.entity.Mascota;
import com.duoc.petcare.repository.CitaRepository;
import com.duoc.petcare.repository.DuenoRepository;
import com.duoc.petcare.repository.MascotaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MascotaService {

    private final MascotaRepository mascotaRepository;
    private final DuenoRepository duenoRepository;
    private final CitaRepository citaRepository;

    public MascotaService(MascotaRepository mascotaRepository,
                          DuenoRepository duenoRepository,
                          CitaRepository citaRepository) {
        this.mascotaRepository = mascotaRepository;
        this.duenoRepository = duenoRepository;
        this.citaRepository = citaRepository;
    }

    public List<Mascota> getAll() {
        return mascotaRepository.findAll();
    }

    public Mascota getById(Long id) {
        return mascotaRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe una mascota con id " + id));
    }

    public Mascota create(Mascota mascota) {
        mascota.setId(null);
        mascota.setDueno(buscarDueno(mascota));
        return mascotaRepository.save(mascota);
    }

    public Mascota update(Long id, Mascota datos) {
        Mascota existente = getById(id);

        existente.setNombre(datos.getNombre());
        existente.setEspecie(datos.getEspecie());
        existente.setRaza(datos.getRaza());
        existente.setFechaNacimiento(datos.getFechaNacimiento());
        existente.setDueno(buscarDueno(datos));
        return mascotaRepository.save(existente);
    }

    public void delete(Long id) {
        mascotaRepository.delete(getById(id));
    }

    public List<Cita> getCitas(Long mascotaId) {
        getById(mascotaId);
        return citaRepository.findByMascotaId(mascotaId);
    }

    // Validacion: el dueno debe existir
    private Dueno buscarDueno(Mascota mascota) {
        if (mascota.getDueno() == null || mascota.getDueno().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe indicar el dueno");
        }
        Long duenoId = mascota.getDueno().getId();
        return duenoRepository.findById(duenoId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe un dueno con id " + duenoId));
    }
}
