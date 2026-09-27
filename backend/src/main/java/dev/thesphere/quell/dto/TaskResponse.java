package dev.thesphere.quell.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import dev.thesphere.quell.model.Task;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record TaskResponse(
        UUID uuid,
        String taskTitle,
        String taskDetails,
        Long workGroupId,
        List<CompletableItemResponse> completableItems,
        Instant timestampCreated,
        int pomodoroMinutes,
        int breakMinutes,
        int priority,
        @JsonProperty("isActive") boolean isActive,
        @JsonProperty("isCompleted") boolean isCompleted,
        Instant completedAt
) {
    public record CompletableItemResponse(String label, boolean done) {}

    public static TaskResponse from(Task t) {
        return new TaskResponse(
                t.getUuid(),
                t.getTaskTitle(),
                t.getTaskDetails(),
                t.getWorkGroupId(),
                t.getCompletableItems().stream()
                        .map(i -> new CompletableItemResponse(i.getLabel(), i.isDone()))
                        .toList(),
                t.getTimestampCreated(),
                t.getPomodoroMinutes(),
                t.getBreakMinutes(),
                t.getPriority(),
                t.isActive(),
                t.isCompleted(),
                t.getCompletedAt()
        );
    }
}
