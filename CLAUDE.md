# Quell — Claude Code Design Document

## What Is Quell

Quell is a task and work-block management app built around structured Pomodoro-style focus sessions. Users schedule work blocks, assign tasks to them, and stay on track through visual cues and habit-loop reinforcement (alarm cue, start craving, timer response, confetti/note reward).

## Tech Stack

- **Frontend:** Angular 22 (standalone components, signals, SCSS)
- **Backend:** Spring Boot 3.3.4, Java 21, Gradle
- **Database:** PostgreSQL 16 (Hibernate DDL auto-update), H2 fallback for local dev
- **Container:** Docker Compose (frontend:4200, backend:8080, postgres:5432, adminer:8888)
- **Package:** `dev.thesphere.quell` (backend), `frontend/src/app/` (frontend)

## Architecture

### Backend Structure
```
backend/src/main/java/dev/thesphere/quell/
├── config/         WebConfig (CORS), LocalDataSourceConfig (H2 fallback)
├── model/          JPA entities: WorkGroup, PomodoroSession, DaysOfWeek, PomodoroState
├── dto/            Records: WorkGroupDTO, PomodoroStartDTO
├── repository/     JpaRepository interfaces
├── service/        WorkGroupService, PomodoroService
├── controller/     REST: /api/group, /api/pomodoro
```

### Frontend Structure
```
frontend/src/app/
├── view/
│   ├── start/              Home screen — clock + 3 work blocks + nav
│   ├── planner/            Weekly schedule view (partial)
│   ├── active-task/        Active task during Pomodoro (stub)
│   └── task-selector/      Grid picker for tasks in a work block (stub)
├── feature/
│   ├── task/               Task display component (stub)
│   ├── work/               WorkComponent card + WorkGroupService
│   ├── clock/pomodoro/     PomodoroComponent + PomodoroService (working)
│   └── creation/
│       ├── creation-form-base.ts   Abstract generic form base
│       ├── task-form/              Task creation form (no backend endpoint yet)
│       └── work-schedule-form/     Work group CRUD form (working)
```

### Routes (app.routes.ts)
- `''` → StartComponent (home)
- `'planner'` → PlannerComponent
- `'active-task'` → ActiveTaskComponent
- `'task-selector'` → TaskSelectorComponent
- `'create/task/:id'` → TaskFormComponent
- `'task-create-test'` → TaskFormComponent (dev test)
- `'work-create-test'` → WorkScheduleFormComponent (dev test)

## Data Models

### WorkGroup (exists — backend entity + DTO + CRUD)
| Field | Type | Notes |
|-------|------|-------|
| id | Long | Auto-generated |
| groupName | String | Display name |
| groupDescription | String | Optional description |
| isRecurring | boolean | Recurring vs one-off |
| daysOfWeek | Set\<DaysOfWeek\> | ElementCollection enum (MONDAY–SUNDAY) |
| startClockTime | String | HH:MM format |
| endClockTime | String | HH:MM format |
| scheduledDate | String | ISO YYYY-MM-DD for one-off blocks |
| active | boolean | Default true |
| createdAt | Instant | Auto-set via @PrePersist |

### PomodoroSession (exists — backend entity + DTO + start/active endpoints)
| Field | Type | Notes |
|-------|------|-------|
| id | Long | Singleton pattern (ID=1) |
| workGroupId | Long | Parent work group |
| startedAt | Instant | Session start time |
| state | PomodoroState | WORK or BREAK |
| workMinutes | int | Work phase duration |
| breakMinutes | int | Break phase duration |

### Task (NOT YET IMPLEMENTED — needs full backend + frontend)
| Field | Type | Notes |
|-------|------|-------|
| uuid | UUID | Unique identifier |
| timestampCreated | Instant | Creation timestamp |
| workGroupId | Long | FK to parent work group |
| taskTitle | String | Display name |
| taskDetails | String | Description / notes |
| completableItems | List | Sub-deliverables (checkbox list) |
| pomodoroMinutes | int | Per-task Pomodoro duration |
| breakMinutes | int | Per-task break duration |
| isActive | boolean | Currently active flag |
| priority | int | Priority level for sorting |

### WorkGroup–Task Relationship
- One WorkGroup has many Tasks (one-to-many)
- Tasks are assigned to work groups via workGroupId
- Work block task selector shows tasks filtered by their parent work group

## Current Implementation Status

### Working
- Docker Compose orchestration (all services start)
- WorkGroup full CRUD: backend entity/DTO/service/controller + frontend form
- Pomodoro timer: backend start/active endpoints + frontend countdown with SVG progress bar
- Start screen: analog clock + work blocks list from API
- CORS configured for localhost:4200
- Routing between views

### Stub / Needs Implementation
- **Task entity, DTO, repository, service, controller** — backend has none of these
- **Task form endpoint** — frontend form exists but backend `/api/task` is missing
- **ActiveTaskComponent** — empty component, needs: task title, details, sub-points, timer, end-task button
- **TaskSelectorComponent** — empty component, needs: grid of tasks in a work block, priority display
- **PlannerComponent** — has date range calc but no task/block display
- **Styling** — most SCSS files are empty or minimal
- **Snooze behavior** — snooze button when Pomodoro ends, extends adjacent blocks
- **Confirmation prompt** — required before ending a task
- **Habit loop reward** — confetti animation or reward text note on completion
- **Task history / actual-vs-planned time tracking**
- **Settings view** — long-press to access, workgroup assignment

## Design Principles

1. **Minimum friction** — adding tasks and work blocks should be fast
2. **Visible schedule at all times** — plan is always in view
3. **Editable views** — nothing feels locked in
4. **Making memories** — the app holds context about your day

## UX Flow (from whiteboard)

1. **Start Screen** → shows clock, 3 work blocks, nav to planner/settings
2. **Work Block Slots** → user taps a work block to see its tasks
3. **Task Selector** → grid of tasks ranked by priority, user picks one to focus on
4. **Active Task View** → task title, details, sub-points, Pomodoro timer with progress bar
5. **On timer end** → snooze button appears; snoozing extends other blocks
6. **On completion** → confetti/reward → return to start screen

## Conventions

- Backend DTOs are Java records
- Frontend uses Angular signals (not BehaviorSubject) for component state
- Frontend uses standalone components (no NgModules)
- Frontend uses `@for` / `@if` control flow (not *ngFor/*ngIf)
- Forms extend `CreationFormBase<T>` abstract class
- API base URLs are hardcoded to `http://localhost:8080/api/` in services
- Pomodoro uses singleton pattern (one active session at a time, ID=1)
- Hibernate manages schema via ddl-auto=update (no migration files)

## API Endpoints

### Existing
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/group | Create work group |
| PUT | /api/group/{id} | Update work group |
| GET | /api/group/{id} | Get work group |
| GET | /api/group | Get all work groups |
| POST | /api/pomodoro/start | Start Pomodoro session |
| GET | /api/pomodoro/active | Get active Pomodoro session |

### Planned (not yet implemented)
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/task | Create task |
| PUT | /api/task/{id} | Update task |
| GET | /api/task/{id} | Get task |
| GET | /api/task | Get all tasks |
| GET | /api/task/group/{groupId} | Get tasks by work group |
| DELETE | /api/task/{id} | Delete task |
| PATCH | /api/task/{id}/active | Toggle task active state |
