package dev.thesphere.quell.dto;

import java.util.List;

public record TaskDTO(
        String taskName,
        String taskDescription,
        String groupName,
        boolean recurring,
        boolean isActive,
        List<String> daysOfWeek,
        String startClockTime,
        String endClockTime,
        String scheduledDate,
        String priority,
        int breakMinutes,
        int workMinutes
) {
}