package dev.thesphere.quell.model;

import dev.thesphere.quell.dto.TaskDTO;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID uuid;

    @Column(nullable = false)
    private String taskTitle;

    private String taskDetails;

    @Column(nullable = false)
    private Long workGroupId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "task_completable_items", joinColumns = @JoinColumn(name = "task_uuid"))
    @OrderColumn(name = "item_order")
    private List<CompletableItem> completableItems = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private Instant timestampCreated;

    @Column(nullable = false)
    private boolean isActive = true;

    @Column(nullable = false)
    private boolean isCompleted = false;

    private Instant completedAt;

    @Column(nullable = false)
    private int pomodoroMinutes;

    @Column(nullable = false)
    private int breakMinutes;

    @Column(nullable = false)
    private int priority;

    @PrePersist
    private void prePersist() {
        timestampCreated = Instant.now();
    }

    public UUID getUuid() { return uuid; }
    public String getTaskTitle() { return taskTitle; }
    public void setTaskTitle(String taskTitle) { this.taskTitle = taskTitle; }
    public String getTaskDetails() { return taskDetails; }
    public void setTaskDetails(String taskDetails) { this.taskDetails = taskDetails; }
    public Long getWorkGroupId() { return workGroupId; }
    public void setWorkGroupId(Long workGroupId) { this.workGroupId = workGroupId; }
    public List<CompletableItem> getCompletableItems() { return completableItems; }
    public void setCompletableItems(List<CompletableItem> completableItems) { this.completableItems = completableItems; }
    public Instant getTimestampCreated() { return timestampCreated; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public boolean isCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
    public int getPomodoroMinutes() { return pomodoroMinutes; }
    public void setPomodoroMinutes(int pomodoroMinutes) { this.pomodoroMinutes = pomodoroMinutes; }
    public int getBreakMinutes() { return breakMinutes; }
    public void setBreakMinutes(int breakMinutes) { this.breakMinutes = breakMinutes; }
    public int getPriority() { return priority; }
    public void setPriority(int priority) { this.priority = priority; }

    public Task replaceDTO(TaskDTO dto) {
        this.taskTitle = dto.taskTitle();
        this.taskDetails = dto.taskDetails();
        this.workGroupId = dto.workGroupId();
        this.pomodoroMinutes = dto.pomodoroMinutes();
        this.breakMinutes = dto.breakMinutes();
        this.priority = dto.priority();
        if (dto.isActive() != null) {
            this.isActive = dto.isActive();
        }
        this.completableItems = dto.completableItems() == null
                ? new ArrayList<>()
                : dto.completableItems().stream()
                        .map(i -> new CompletableItem(i.label(), i.done()))
                        .collect(Collectors.toList());
        return this;
    }
}
