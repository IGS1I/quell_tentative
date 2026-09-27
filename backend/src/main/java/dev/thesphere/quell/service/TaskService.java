package dev.thesphere.quell.service;

import dev.thesphere.quell.dto.TaskDTO;
import dev.thesphere.quell.model.Task;
import dev.thesphere.quell.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskService {

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public Task create(TaskDTO dto) {
        return repository.save(new Task().replaceDTO(dto));
    }

    public Optional<Task> findById(UUID id) {
        return repository.findById(id);
    }

    public Task save(Task task) {
        return repository.save(task);
    }

    public List<Task> findAll() {
        return repository.findAll();
    }

    public List<Task> findByWorkGroupId(Long groupId) {
        return repository.findByWorkGroupId(groupId);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

    public Optional<Task> toggleActive(UUID id) {
        return repository.findById(id).map(task -> {
            task.setActive(!task.isActive());
            return repository.save(task);
        });
    }

    public Optional<Task> complete(UUID id) {
        return repository.findById(id).map(task -> {
            task.setActive(false);
            task.setCompleted(true);
            task.setCompletedAt(Instant.now());
            return repository.save(task);
        });
    }
}
