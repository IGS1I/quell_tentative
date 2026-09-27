package dev.thesphere.quell.service;

import dev.thesphere.quell.dto.PomodoroStartDTO;
import dev.thesphere.quell.model.PomodoroSession;
import dev.thesphere.quell.model.PomodoroState;
import dev.thesphere.quell.repository.PomodoroSessionRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class PomodoroService {

    private static final Long SINGLETON_ID = 1L;

    private final PomodoroSessionRepository repository;

    public PomodoroService(PomodoroSessionRepository repository) {
        this.repository = repository;
    }

    public PomodoroSession start(PomodoroStartDTO dto) {
        PomodoroSession session = repository.findById(SINGLETON_ID).orElse(new PomodoroSession());
        session.setId(SINGLETON_ID);
        session.setWorkGroupId(dto.workGroupId());
        session.setStartedAt(dto.startedAt() != null ? Instant.parse(dto.startedAt()) : Instant.now());
        session.setState(PomodoroState.WORK);
        session.setWorkMinutes(dto.workMinutes());
        session.setBreakMinutes(dto.breakMinutes());
        return repository.save(session);
    }

    public void stop() {
        repository.deleteById(SINGLETON_ID);
    }

    public Optional<PomodoroSession> findActive() {
        return repository.findById(SINGLETON_ID).filter(s -> {
            long elapsed = Instant.now().getEpochSecond() - s.getStartedAt().getEpochSecond();
            return elapsed < s.getWorkMinutes() * 60L;
        });
    }
}
