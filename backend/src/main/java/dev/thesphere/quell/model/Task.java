package dev.thesphere.quell.model;

import dev.thesphere.quell.dto.TaskDTO;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "tasks")
public class Task {

    // Create UUID for task
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Task Details
    @Column(nullable = false)
    private String taskName;
    private String taskDescription;

    // Is Task Recurring
    @Column(nullable = false)
    private boolean isRecurring;

    // Work Group
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_group_id")
    private WorkGroup workGroup;

    // Days of the week
    @ElementCollection(targetClass = DaysOfWeek.class, fetch = FetchType.EAGER)
    @Column(name = "day_of_week", nullable = false)
    @Enumerated(EnumType.STRING)
    private List<DaysOfWeek> daysOfWeek = new ArrayList<>();

    // Task Creation time
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    // Whether the task is active or not
    @Column(nullable = false)
    private boolean isActive = true;

    @Column(nullable = false)
    private String startClockTime;
    private String endClockTime;
    private String scheduledDate;

    // Task Priority
    @Column(nullable = false)
    private String priority;

    // Time to spend on a break
    @Column(nullable = false)
    private int breakMinutes;

    // Time to spend working
    @Column(nullable = false)
    private int workMinutes;

    // Functions for generating DTO
    @PrePersist
    private void prePersist() {
        createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getTaskName() { return taskName; }
    public void setTaskName(String taskName) { this.taskName = taskName; }
    public String getTaskDescription() { return taskDescription; }
    public void setTaskDescription(String taskDescription) { this.taskDescription = taskDescription; }
    public boolean isRecurring() { return isRecurring; }
    public void setRecurring(boolean recurring) { isRecurring = recurring; }
    public WorkGroup getWorkGroup() { return workGroup; }
    public void setWorkGroup(WorkGroup workGroup) { this.workGroup = workGroup; }
    public List<DaysOfWeek> getDaysOfWeek() { return daysOfWeek; }
    public void setDaysOfWeek(List<DaysOfWeek> daysOfWeek) { this.daysOfWeek = daysOfWeek; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public String getStartClockTime() { return startClockTime; }
    public void setStartClockTime(String startClockTime) { this.startClockTime = startClockTime; }
    public String getEndClockTime() { return endClockTime; }
    public void setEndClockTime(String endClockTime) { this.endClockTime = endClockTime; }
    public String getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(String scheduledDate) { this.scheduledDate = scheduledDate; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public int getBreakMinutes() { return breakMinutes; }
    public void setBreakMinutes(int breakMinutes) { this.breakMinutes = breakMinutes; }
    public int getWorkMinutes() { return workMinutes; }
    public void setWorkMinutes(int workMinutes) { this.workMinutes = workMinutes; }

    public Task replaceDTO(TaskDTO dto) {
        this.taskName = dto.taskName();
        this.taskDescription = dto.taskDescription();
        this.isRecurring = dto.isRecurring();
        this.isActive = dto.isActive();
        this.startClockTime = dto.startClockTime();
        this.endClockTime = dto.endClockTime();
        this.priority = dto.priority();
        this.breakMinutes = dto.breakMinutes();
        this.workMinutes = dto.workMinutes();
        if (dto.isRecurring() && dto.daysOfWeek() != null) {
            this.daysOfWeek = dto.daysOfWeek().stream()
                    .map(DaysOfWeek::valueOf)
                    .collect(Collectors.toList());
        } else {
            this.daysOfWeek = new ArrayList<>();
            this.scheduledDate = dto.scheduledDate();
        }

        return this;
    }
}

