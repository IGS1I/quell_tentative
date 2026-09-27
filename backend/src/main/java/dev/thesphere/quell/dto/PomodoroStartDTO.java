package dev.thesphere.quell.dto;

public record PomodoroStartDTO(
        Long workGroupId,
        String startedAt,
        int workMinutes,
        int breakMinutes
) {}
