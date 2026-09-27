package dev.thesphere.quell.controller;

import dev.thesphere.quell.dto.TaskDTO;
import dev.thesphere.quell.dto.TaskResponse;
import dev.thesphere.quell.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/task")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@RequestBody TaskDTO dto) {
        return ResponseEntity.ok(TaskResponse.from(service.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> update(@RequestBody TaskDTO dto, @PathVariable UUID id) {
        return service.findById(id)
                .map(task -> ResponseEntity.ok(TaskResponse.from(service.save(task.replaceDTO(dto)))))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> get(@PathVariable UUID id) {
        return service.findById(id)
                .map(t -> ResponseEntity.ok(TaskResponse.from(t)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAll() {
        return ResponseEntity.ok(service.findAll().stream().map(TaskResponse::from).toList());
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<TaskResponse>> getByGroup(@PathVariable Long groupId) {
        return ResponseEntity.ok(service.findByWorkGroupId(groupId).stream().map(TaskResponse::from).toList());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<TaskResponse> toggleActive(@PathVariable UUID id) {
        return service.toggleActive(id)
                .map(t -> ResponseEntity.ok(TaskResponse.from(t)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskResponse> complete(@PathVariable UUID id) {
        return service.complete(id)
                .map(t -> ResponseEntity.ok(TaskResponse.from(t)))
                .orElse(ResponseEntity.notFound().build());
    }
}
