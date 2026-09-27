package dev.thesphere.quell.dto;

import java.util.List;

public record TaskDTO(
        String taskTitle,
        String taskDetails,
        Long workGroupId,
        List<CompletableItemDTO> completableItems,
        int pomodoroMinutes,
        int breakMinutes,
        int priority,
        Boolean isActive
) {
    public record CompletableItemDTO(String label, boolean done) {}
}
