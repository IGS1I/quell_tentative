package dev.thesphere.quell.model;

import dev.thesphere.quell.dto.WorkGroupDTO;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "work_groups")
public class WorkGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String groupName;

    private String groupDescription;

    // if true, the task is repeated based on the daysOfWeek
    @Column(nullable = false)
    boolean isRecurring;


    // https://stackoverflow.com/questions/15998824/mapping-setenum-using-elementcollection
    @ElementCollection(targetClass = DaysOfWeek.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "work_group_days", joinColumns = @JoinColumn(name = "work_group_id"))
    @Column(name = "day_of_week", nullable = false)
    @Enumerated(EnumType.STRING)
    private List<DaysOfWeek> daysOfWeek = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt;


    // ex: starts at 9AM, this is time based rather than now
    private String startClockTime;
    private String endClockTime; // we need to handle next day cases (1AM)

    // for non-recurring: the specific date (ISO format YYYY-MM-DD)
    private String scheduledDate;

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
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getStartClockTime() {
        return startClockTime;
    }

    public void setStartClockTime(String startClockTime) {
        this.startClockTime = startClockTime;
    }

    public String getEndClockTime() {
        return endClockTime;
    }

    public void setEndClockTime(String endClockTime) {
        this.endClockTime = endClockTime;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isRecurring() {
        return isRecurring;
    }

    public void setRecurring(boolean recurring) {
        isRecurring = recurring;
    }

    public List<DaysOfWeek> getDaysOfWeek() {
        return daysOfWeek;
    }

    public void setDaysOfWeek(List<DaysOfWeek> daysOfWeek) {
        this.daysOfWeek = daysOfWeek;
    }
    public String getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(String scheduledDate) { this.scheduledDate = scheduledDate; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public WorkGroup replaceDTO(WorkGroupDTO dto) {
        this.groupName = dto.groupName();
        this.groupDescription = dto.groupDescription();
        this.isRecurring = dto.recurring();
        this.startClockTime = dto.startClockTime();
        this.endClockTime = dto.endClockTime();

        if (dto.recurring() && dto.daysOfWeek() != null) {
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
