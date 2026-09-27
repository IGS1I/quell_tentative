package dev.thesphere.quell.controller;

import dev.thesphere.quell.dto.WorkGroupDTO;
import dev.thesphere.quell.dto.WorkGroupResponse;
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
    public ResponseEntity<WorkGroupResponse> create(@RequestBody WorkGroupDTO dto) {
        return ResponseEntity.ok(WorkGroupResponse.from(service.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkGroupResponse> update(@RequestBody WorkGroupDTO dto, @PathVariable Long id) {
        return service.findById(id)
                .map(wg -> ResponseEntity.ok(WorkGroupResponse.from(service.save(wg.replaceDTO(dto)))))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkGroupResponse> get(@PathVariable Long id) {
        return service.findById(id)
                .map(wg -> ResponseEntity.ok(WorkGroupResponse.from(wg)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<WorkGroupResponse>> getAll() {
        return ResponseEntity.ok(
                service.findAll().stream().map(WorkGroupResponse::from).toList()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.existsById(id)) return ResponseEntity.notFound().build();
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
