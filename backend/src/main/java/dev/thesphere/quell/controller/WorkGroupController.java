package dev.thesphere.quell.controller;

import dev.thesphere.quell.dto.WorkGroupDTO;
import dev.thesphere.quell.model.WorkGroup;
import dev.thesphere.quell.service.WorkGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/group")
public class WorkGroupController {

    private final WorkGroupService service;

    public WorkGroupController(WorkGroupService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<WorkGroup> create(@RequestBody WorkGroupDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkGroup> update(@RequestBody WorkGroupDTO dto, @PathVariable Long id) {
        return service.findById(id)
                .map(wg -> ResponseEntity.ok(service.save(wg.replaceDTO(dto))))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkGroup> get(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<WorkGroup>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }
}
