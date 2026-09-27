package dev.thesphere.quell.service;

import dev.thesphere.quell.dto.TaskDTO;
import dev.thesphere.quell.model.Task;
import dev.thesphere.quell.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public Task create(TaskDTO dto) {
        Task task = new Task();
        task.replaceDTO(dto);
        return repository.save(task);
    }

    public Optional<Task> findById(Long id) {
        return repository.findById(id);
    }

    public Task save(Task task) {
        return repository.save(task);
    }

    public List<Task> findAll() {
        return repository.findAll();
    }
}