import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CompletableItem, Task } from '../../task/task.model';
import { TaskService } from '../../task/task.service';
import { WorkGroup } from '../../work/work-group.model';
import { WorkGroupService } from '../../work/work-group.service';
import { CreationFormBase } from '../creation-form-base';

/** Route: create/task/:id (create) or edit/task/:uuid (edit). */
@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.component.html',
  styleUrl: '../creation-form.scss',
})
export class TaskFormComponent extends CreationFormBase<Task> {
  private readonly tasks = inject(TaskService);
  private readonly groupService = inject(WorkGroupService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Only set in create mode (from the route param). */
  protected readonly createGroupId = signal(0);
  /** UUID when editing an existing task; null when creating. */
  protected readonly editUuid = signal<string | null>(null);
  /** Groups list for the reassignment select (edit mode only). */
  protected readonly groups = this.groupService.groups;

  protected readonly items = new FormArray<FormControl<string>>([]);
  /** Cached to preserve done-states when saving from edit mode. */
  private originalItems: CompletableItem[] = [];

  protected readonly form = new FormGroup({
    taskTitle: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    taskDetails: new FormControl('', { nonNullable: true }),
    workGroupId: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    pomodoroMinutes: new FormControl(25, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    breakMinutes: new FormControl(5, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    priority: new FormControl(1, { nonNullable: true }),
    items: this.items,
  });

  constructor() {
    super();
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.editUuid.set(uuid);
      this.groupService.load();
      this.tasks.get(uuid).subscribe((task) => {
        this.originalItems = task.completableItems;
        this.form.patchValue({
          taskTitle: task.taskTitle,
          taskDetails: task.taskDetails ?? '',
          workGroupId: task.workGroupId,
          pomodoroMinutes: task.pomodoroMinutes,
          breakMinutes: task.breakMinutes,
          priority: task.priority,
        });
        task.completableItems.forEach((item) =>
          this.items.push(new FormControl(item.label, { nonNullable: true })),
        );
      });
    } else {
      const id = Number(this.route.snapshot.paramMap.get('id') ?? 1);
      this.createGroupId.set(id);
      this.form.patchValue({ workGroupId: id });
    }
  }

  protected addItem(): void {
    this.items.push(new FormControl('', { nonNullable: true }));
  }

  protected removeItem(index: number): void {
    this.items.removeAt(index);
  }

  protected toPayload(): Task {
    const v = this.form.getRawValue();
    return {
      uuid: this.editUuid() ?? undefined,
      workGroupId: v.workGroupId,
      taskTitle: v.taskTitle.trim(),
      taskDetails: v.taskDetails.trim(),
      pomodoroMinutes: v.pomodoroMinutes,
      breakMinutes: v.breakMinutes,
      priority: v.priority,
      // Preserve done-states for unchanged labels; reset new labels to false.
      completableItems: v.items
        .map((l) => l.trim())
        .filter(Boolean)
        .map((label) => {
          const orig = this.originalItems.find((i) => i.label === label);
          return { label, done: orig?.done ?? false };
        }),
    };
  }

  protected persist(payload: Task): Observable<Task> {
    return this.tasks.save(payload);
  }

  protected onSaved(): void {
    this.router.navigate(this.editUuid() ? ['/settings'] : ['/task-selector', this.createGroupId()]);
  }

  protected deleteTask(): void {
    const uuid = this.editUuid();
    if (!uuid || !confirm('Delete this task?')) return;
    this.tasks.delete(uuid).subscribe(() => this.router.navigate(['/settings']));
  }
}
