package dev.thesphere.quell.service;

import dev.thesphere.quell.dto.WorkGroupDTO;
import dev.thesphere.quell.model.WorkGroup;
import dev.thesphere.quell.repository.WorkGroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkGroupService {

    private final WorkGroupRepository repository;

    public WorkGroupService(WorkGroupRepository repository) {
        this.repository = repository;
    }

    public WorkGroup create(WorkGroupDTO dto) {
        WorkGroup wg = new WorkGroup();
        wg.replaceDTO(dto);
        return repository.save(wg);
    }

    public Optional<WorkGroup> findById(Long id) {
        return repository.findById(id);
    }

    public WorkGroup save(WorkGroup wg) {
        return repository.save(wg);
    }

    public List<WorkGroup> findAll() {
        return repository.findAll();
    }
}
