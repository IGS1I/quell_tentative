package dev.thesphere.quell.repository;

import dev.thesphere.quell.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}