package dev.thesphere.quell.dto;

import dev.thesphere.quell.model.WorkGroup;

import java.time.Instant;
import java.util.List;

public record WorkGroupResponse(
        Long id,
        String groupName,
        String groupDescription,
        boolean recurring,
        List<String> daysOfWeek,
        String startClockTime,
        String endClockTime,
        String scheduledDate,
        boolean active,
        Instant createdAt
) {
    public static WorkGroupResponse from(WorkGroup wg) {
        return new WorkGroupResponse(
                wg.getId(),
                wg.getGroupName(),
                wg.getGroupDescription(),
                wg.isRecurring(),
                wg.getDaysOfWeek().stream().map(Enum::name).toList(),
                wg.getStartClockTime(),
                wg.getEndClockTime(),
                wg.getScheduledDate(),
                wg.isActive(),
                wg.getCreatedAt()
        );
    }
}
