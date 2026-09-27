package dev.thesphere.quell.controller;

import dev.thesphere.quell.dto.PomodoroStartDTO;
import dev.thesphere.quell.model.PomodoroSession;
import dev.thesphere.quell.service.PomodoroService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pomodoro")
public class PomodoroController {

    private final PomodoroService service;

    public PomodoroController(PomodoroService service) {
        this.service = service;
    }

    @PostMapping("/start")
    public ResponseEntity<PomodoroSession> start(@RequestBody PomodoroStartDTO dto) {
        return ResponseEntity.ok(service.start(dto));
    }

    @DeleteMapping
    public ResponseEntity<Void> stop() {
        service.stop();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/active")
    public ResponseEntity<PomodoroSession> getActive() {
        return service.findActive()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}
