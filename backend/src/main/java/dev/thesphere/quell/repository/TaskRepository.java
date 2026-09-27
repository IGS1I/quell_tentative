package dev.thesphere.quell.repository;

import dev.thesphere.quell.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByWorkGroupId(Long workGroupId);
}
