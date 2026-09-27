import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskComponent } from '../../feature/task/task.component';
import { Task } from '../../feature/task/task.model';
import { TaskService } from '../../feature/task/task.service';
import { WorkGroup } from '../../feature/work/work-group.model';
import { WorkGroupService } from '../../feature/work/work-group.service';

/** Grid of a work block's tasks, ranked by priority. Picking one starts its Pomodoro. */
@Component({
  selector: 'app-task-selector',
  imports: [TaskComponent, RouterLink],
  templateUrl: './task-selector.component.html',
  styleUrl: './task-selector.component.scss',
})
export class TaskSelectorComponent {
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);

  protected readonly groupId = Number(inject(ActivatedRoute).snapshot.paramMap.get('groupId'));
  protected readonly group = signal<WorkGroup | null>(null);
  protected readonly tasks = signal<Task[]>([]);
  protected readonly loading = signal(true);

  protected readonly pendingTasks = computed(() => this.tasks().filter((t) => !t.isCompleted));
  protected readonly completedTasks = computed(() => this.tasks().filter((t) => t.isCompleted));
  /** The task already marked active in this group, if any. */
  protected readonly activeTask = computed(() => this.pendingTasks().find((t) => t.isActive) ?? null);
  /** True when one task is already active — other tasks are locked. */
  protected readonly hasActive = computed(() => this.activeTask() !== null);

  constructor() {
    inject(WorkGroupService).get(this.groupId).subscribe((g) => this.group.set(g));
    this.taskService.byGroup(this.groupId).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected pick(task: Task): void {
    if (this.hasActive() && !task.isActive) return;
    if (!task.isActive) {
      this.taskService.toggleActive(task.uuid!).subscribe();
    }
    this.router.navigate(['/active-task', task.uuid]);
  }
}
