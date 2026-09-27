package dev.sphere.quell.repository;

import dev.sphere.quell.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}