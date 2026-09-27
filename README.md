# Quell — Productivity & Time-Block Manager

> Whiteboard planning session reference: `reference/` folder (2026-09-27)

---

## Overview

Quell is a task and work-block management app built around structured focus sessions (Pomodoro-style). The core idea is to give users a minimal friction way to schedule work blocks, assign tasks to them, and stay on track through visual cues and habit-loop reinforcement.

---

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | Angular                 |
| Backend   | Spring Boot             |
| Database  | PostgreSQL + Hibernate  |
| Container | Docker / Docker Compose |

---

## Design Principles

- **Minimum friction** when adding a new task or work block.
- **Making memories** — the app should feel like it holds context about your day.
- **Visible schedule at all times** — your plan is always in view.
- **Editable views** — nothing should feel locked in.

---

## Views & UX Flow

### 1. Start Screen (no current tasks)
- Displays the current date, time (analog clock style), and day of week.
- Shows a **flexbox of only 3 scheduled tasks/work blocks** — no overflow.
- A **work and task popup** (one-to-many relationship) is accessible here for creating both tasks and work blocks.
- Tapping anywhere on screen for ~20–30 seconds opens **Settings**.
- A **Planner View** is accessible from here — shows the full day and opens the settings component (planner as an option).

### 2. Planner View
- Shows the entire day's schedule.
- Week range displayed: e.g. Sep 1 – Sep 7.
- Tasks/work blocks are **ranked and sorted by priority**.
- Settings can be accessed from this view.

### 3. Work View — Task Selector
- Grid-based selector for choosing tasks to add to a work block (Pomodoro session).
- Grouped views: tasks are shown as part of their parent work block.

### 4. Work Block — Active State
- Displays:
  - Tasks available to choose for the current Pomodoro session.
  - Task priorities.
- On completion: returns to the home view.

### 5. Task View (Active)
- Header: task route (e.g. `task/eid3/oct.26`), current time.
- Body:
  - Task title
  - Task details
  - Sub-points / deliverables (checkbox list — optional feature)
  - Timer display (e.g. 35 min / 50 min)
- **End Task button** — opens a confirmation prompt before ending.
- **Pomodoro timer**: configured per-task as a setting.

### 6. Settings
- Accessible by long-press (~20–30 seconds anywhere on screen).
- Contains: task-to-workgroup assignment, planner options.
- Tasks need a way in Settings to join a workgroup.

---

## Habit Loop (Behavioral Design)

The work block flow is intentionally designed around a habit loop:

| Step      | Description                                                      |
|-----------|------------------------------------------------------------------|
| **Cue**      | Alarm noise when a work block starts or ends                  |
| **Craving**  | User presses "Start Work Block"                               |
| **Response** | A timer / progress bar counts down                            |
| **Reward**   | Canvas confetti animation, or a text note reminder to reward yourself |

---

## Pomodoro / Snooze Behavior

- Pomodoro length is configured **per task** (not globally).
- When a Pomodoro ends, a **Snooze button** appears.
- Snoozing should **extend adjacent work blocks** and adjust the rest of the day accordingly.
- The system should track **actual vs. planned time** for each session (for historical reference).

---

## Data Models

### Task DTO

| Field               | Description                              |
|---------------------|------------------------------------------|
| `uuid`              | Unique identifier                        |
| `timestampCreated`  | When the task was created                |
| `workGroupId`       | Reference to parent work group           |
| `taskTitle`         | Display name                             |
| `taskDetails`       | Description / notes                      |
| `completableItems`  | Sub-deliverables (checkbox list)         |
| `breakMeter`        | Tracks break behavior                    |
| `isActive`          | Whether the task is currently active     |
| `priority`          | Priority level                           |

### Work Group DTO

| Field              | Description                              |
|--------------------|------------------------------------------|
| `uuid`             | Unique identifier                        |
| `workGroupName`    | Display name                             |
| `workGroupTime`    | Duration of the work block               |
| `startTimeEngaged` | Actual start time                        |
| `endTimeProjected` | Expected end time                        |

---

## Task History

- Each task records **actual start/end times** for post-session review.
- A time table comparing **actual vs. chosen** time is planned.
- Goal: help users understand how long things actually take.

---

## Features Roadmap

### In Scope
- Visible schedule at all times
- Editable views
- Kanban board for life tasks
- Easy and smooth task creation
- Workgroup support (implemented)
- Task definition and assignment (in progress)

### Stretch Goals
- Snooze that propagates across the day
- AI-assisted scheduling (Snowflake → Gemini → LLM pipeline sketched)
- "Finish state" and "begin state" for tasks
- Grouped views: tasks shown as part of their parent work blocks

---

## Dev Setup TODOs

1. Figure out where Spring Boot service is deployed / running.
2. Set up Tailwind CSS in Chromium/browser mode.
3. Implement Task DTOs and endpoints.

---

## Notes from Planning Session

- Work block task selector should show priorities and let the user pick what to pomodoro on.
- Confirmation prompt required before ending a task to prevent accidental closes.
- Checkbox deliverables on the task view are **optional** — marked as such.
- "Jello workgroup" reference in settings = a way to assign/reassign tasks between workgroups.
