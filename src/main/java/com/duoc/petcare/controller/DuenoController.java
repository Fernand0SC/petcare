package com.duoc.petcare.controller;

import com.duoc.petcare.entity.Dueno;
import com.duoc.petcare.entity.Mascota;
import com.duoc.petcare.service.DuenoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/duenos")
public class DuenoController {

    private final DuenoService duenoService;

    public DuenoController(DuenoService duenoService) {
        this.duenoService = duenoService;
    }

    @GetMapping
    public List<Dueno> getAll() {
        return duenoService.getAll();
    }

    @GetMapping("/{id}")
    public Dueno getById(@PathVariable Long id) {
        return duenoService.getById(id);
    }

    @PostMapping
    public Dueno create(@RequestBody Dueno dueno) {
        return duenoService.create(dueno);
    }

    @PutMapping("/{id}")
    public Dueno update(@PathVariable Long id, @RequestBody Dueno dueno) {
        return duenoService.update(id, dueno);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        duenoService.delete(id);
    }

    @GetMapping("/{id}/mascotas")
    public List<Mascota> getMascotas(@PathVariable Long id) {
        return duenoService.getMascotas(id);
    }
}
