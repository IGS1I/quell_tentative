package dev.thesphere.quell.service;

import dev.thesphere.quell.dto.WorkGroupDTO;
import dev.thesphere.quell.model.DaysOfWeek;
import dev.thesphere.quell.model.WorkGroup;
import dev.thesphere.quell.repository.WorkGroupRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WorkGroupService {

    private final WorkGroupRepository repository;

    public WorkGroupService(WorkGroupRepository repository) {
        this.repository = repository;
    }

    public WorkGroup create(WorkGroupDTO dto) {
        checkOverlap(dto, null);
        WorkGroup wg = new WorkGroup();
        wg.replaceDTO(dto);
        return repository.save(wg);
    }

    public Optional<WorkGroup> findById(Long id) {
        return repository.findById(id);
    }

    public WorkGroup save(WorkGroup wg) {
        checkOverlap(wg, wg.getId());
        return repository.save(wg);
    }

    public List<WorkGroup> findAll() {
        return repository.findAll();
    }

    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private void checkOverlap(WorkGroupDTO dto, Long excludeId) {
        int newStart = parseMinutes(dto.startClockTime());
        int newEnd = parseMinutes(dto.endClockTime());
        List<DaysOfWeek> newDays = dto.recurring() && dto.daysOfWeek() != null
                ? dto.daysOfWeek().stream().map(DaysOfWeek::valueOf).collect(Collectors.toList())
                : Collections.emptyList();

        for (WorkGroup existing : repository.findAll()) {
            if (excludeId != null && excludeId.equals(existing.getId())) continue;
            if (!existing.isActive()) continue;
            if (!sharesDay(dto.recurring(), newDays, dto.scheduledDate(), existing)) continue;

            int exStart = parseMinutes(existing.getStartClockTime());
            int exEnd = parseMinutes(existing.getEndClockTime());
            if (newStart < exEnd && exStart < newEnd) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Overlaps with \"" + existing.getGroupName()
                                + "\" (" + existing.getStartClockTime() + " – " + existing.getEndClockTime() + ")");
            }
        }
    }

    private void checkOverlap(WorkGroup wg, Long excludeId) {
        int newStart = parseMinutes(wg.getStartClockTime());
        int newEnd = parseMinutes(wg.getEndClockTime());

        for (WorkGroup existing : repository.findAll()) {
            if (excludeId != null && excludeId.equals(existing.getId())) continue;
            if (!existing.isActive()) continue;
            if (!sharesDay(wg.isRecurring(), wg.getDaysOfWeek(), wg.getScheduledDate(), existing)) continue;

            int exStart = parseMinutes(existing.getStartClockTime());
            int exEnd = parseMinutes(existing.getEndClockTime());
            if (newStart < exEnd && exStart < newEnd) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Overlaps with \"" + existing.getGroupName()
                                + "\" (" + existing.getStartClockTime() + " – " + existing.getEndClockTime() + ")");
            }
        }
    }

    private boolean sharesDay(boolean newRecurring, List<DaysOfWeek> newDays, String newDate, WorkGroup existing) {
        if (newRecurring && existing.isRecurring()) {
            return !Collections.disjoint(newDays, existing.getDaysOfWeek());
        }
        if (!newRecurring && !existing.isRecurring()) {
            return newDate != null && newDate.equals(existing.getScheduledDate());
        }
        // One recurring, one not — check if the one-off's date falls on a recurring day
        String oneOffDate = newRecurring ? existing.getScheduledDate() : newDate;
        List<DaysOfWeek> recurringDays = newRecurring ? newDays : existing.getDaysOfWeek();
        if (oneOffDate == null) return false;
        DaysOfWeek dayOfDate = DaysOfWeek.valueOf(LocalDate.parse(oneOffDate).getDayOfWeek().name());
        return recurringDays.contains(dayOfDate);
    }

    private static int parseMinutes(String clockTime) {
        if (clockTime == null || clockTime.isEmpty()) return 0;
        String[] parts = clockTime.split(":");
        return Integer.parseInt(parts[0]) * 60 + Integer.parseInt(parts[1]);
    }
}
