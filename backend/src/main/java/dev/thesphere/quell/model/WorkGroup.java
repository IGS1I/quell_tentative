package dev.thesphere.quell.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "work_groups")
public class WorkGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String groupName;

    private String groupDescription;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant startTime;

    private Instant endTime;

    @Column(nullable = false)
    private boolean active = true;

    @PrePersist
    private void prePersist() {
        createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
    public String getGroupDescription() { return groupDescription; }
    public void setGroupDescription(String groupDescription) { this.groupDescription = groupDescription; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }
    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
