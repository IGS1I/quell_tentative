import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Task } from '../../feature/task/task.model';
import { TaskService } from '../../feature/task/task.service';
import { WorkGroup } from '../../feature/work/work-group.model';
import { WorkGroupService } from '../../feature/work/work-group.service';

/** Read-only task list for a work block that isn't currently active. Clicking a task opens its edit form. */
@Component({
  selector: 'app-task-browser',
  imports: [RouterLink],
  templateUrl: './task-browser.component.html',
  styleUrl: './task-browser.component.scss',
})
export class TaskBrowserComponent {
  private readonly taskService = inject(TaskService);
  protected readonly location = inject(Location);

  protected readonly groupId = Number(inject(ActivatedRoute).snapshot.paramMap.get('groupId'));
  protected readonly group = signal<WorkGroup | null>(null);
  protected readonly tasks = signal<Task[]>([]);
  protected readonly loading = signal(true);

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
}
