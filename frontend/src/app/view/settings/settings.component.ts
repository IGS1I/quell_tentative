import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlarmService } from '../../feature/reward/alarm.service';
import { Task } from '../../feature/task/task.model';
import { TaskService } from '../../feature/task/task.service';
import { WorkGroup } from '../../feature/work/work-group.model';
import { WorkGroupService } from '../../feature/work/work-group.service';

@Component({
  selector: 'app-settings',
  imports: [RouterLink],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  private readonly groupService = inject(WorkGroupService);
  private readonly taskService = inject(TaskService);
  protected readonly alarm = inject(AlarmService);

  protected readonly groups = this.groupService.groups;
  protected readonly tasks = signal<Task[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.groupService.load();
    this.taskService.getAll().subscribe({
      next: (t) => {
        this.tasks.set(t);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected tasksForGroup(groupId: number): Task[] {
    return this.tasks()
      .filter((t) => t.workGroupId === groupId)
      .sort((a, b) => b.priority - a.priority);
  }

  protected deleteGroup(group: WorkGroup): void {
    if (!confirm(`Delete "${group.groupName}" and all its tasks?`)) return;
    this.groupService.delete(group.id!).subscribe(() =>
      this.tasks.update((all) => all.filter((t) => t.workGroupId !== group.id)),
    );
  }

  protected deleteTask(uuid: string, title: string): void {
    if (!confirm(`Delete "${title}"?`)) return;
    this.taskService.delete(uuid).subscribe(() =>
      this.tasks.update((all) => all.filter((t) => t.uuid !== uuid)),
    );
  }
}
