package dev.thesphere.quell.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "pomodoro_sessions")
public class PomodoroSession {

    @Id
    private Long id;

    @Column(nullable = false)
    private Long workGroupId;

    @Column(nullable = false)
    private Instant startedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PomodoroState state;

    @Column(nullable = false)
    private int workMinutes;

    @Column(nullable = false)
    private int breakMinutes;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getWorkGroupId() { return workGroupId; }
    public void setWorkGroupId(Long workGroupId) { this.workGroupId = workGroupId; }

    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }

    public PomodoroState getState() { return state; }
    public void setState(PomodoroState state) { this.state = state; }

    public int getWorkMinutes() { return workMinutes; }
    public void setWorkMinutes(int workMinutes) { this.workMinutes = workMinutes; }

    public int getBreakMinutes() { return breakMinutes; }
    public void setBreakMinutes(int breakMinutes) { this.breakMinutes = breakMinutes; }
}
