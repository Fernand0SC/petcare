package com.duoc.petcare.service;

import com.duoc.petcare.entity.Dueno;
import com.duoc.petcare.entity.Mascota;
import com.duoc.petcare.repository.DuenoRepository;
import com.duoc.petcare.repository.MascotaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DuenoService {

    private final DuenoRepository duenoRepository;
    private final MascotaRepository mascotaRepository;

    public DuenoService(DuenoRepository duenoRepository, MascotaRepository mascotaRepository) {
        this.duenoRepository = duenoRepository;
        this.mascotaRepository = mascotaRepository;
    }

    public List<Dueno> getAll() {
        return duenoRepository.findAll();
    }

    public Dueno getById(Long id) {
        return duenoRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe un dueno con id " + id));
    }

    public Dueno create(Dueno dueno) {
        dueno.setId(null);
        return duenoRepository.save(dueno);
    }

    public Dueno update(Long id, Dueno datos) {
        Dueno existente = getById(id);

        existente.setRut(datos.getRut());
        existente.setNombre(datos.getNombre());
        existente.setTelefono(datos.getTelefono());
        existente.setEmail(datos.getEmail());
        return duenoRepository.save(existente);
    }

    public void delete(Long id) {
        duenoRepository.delete(getById(id));
    }

    public List<Mascota> getMascotas(Long duenoId) {
        getById(duenoId);
        return mascotaRepository.findByDuenoId(duenoId);
    }
}
