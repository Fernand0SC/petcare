package com.duoc.petcare.controller;

import com.duoc.petcare.entity.Cita;
import com.duoc.petcare.entity.Mascota;
import com.duoc.petcare.service.MascotaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    private final MascotaService mascotaService;

    public MascotaController(MascotaService mascotaService) {
        this.mascotaService = mascotaService;
    }

    @GetMapping
    public List<Mascota> getAll() {
        return mascotaService.getAll();
    }

    @GetMapping("/{id}")
    public Mascota getById(@PathVariable Long id) {
        return mascotaService.getById(id);
    }

    @PostMapping
    public Mascota create(@RequestBody Mascota mascota) {
        return mascotaService.create(mascota);
    }

    @PutMapping("/{id}")
    public Mascota update(@PathVariable Long id, @RequestBody Mascota mascota) {
        return mascotaService.update(id, mascota);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        mascotaService.delete(id);
    }

    @GetMapping("/{id}/citas")
    public List<Cita> getCitas(@PathVariable Long id) {
        return mascotaService.getCitas(id);
    }
}
