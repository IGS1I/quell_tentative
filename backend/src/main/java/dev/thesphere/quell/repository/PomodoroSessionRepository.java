package dev.thesphere.quell.repository;

import dev.thesphere.quell.model.PomodoroSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PomodoroSessionRepository extends JpaRepository<PomodoroSession, Long> {}
