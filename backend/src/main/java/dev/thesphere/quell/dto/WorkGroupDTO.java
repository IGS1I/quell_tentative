package dev.thesphere.quell.dto;

import java.util.List;

public record WorkGroupDTO(
        String groupName,
        String groupDescription,
        boolean recurring,
        List<String> daysOfWeek,
        String startClockTime,
        String endClockTime,
        String scheduledDate
) {
}
