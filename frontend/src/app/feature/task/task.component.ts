import { Component, input, output } from '@angular/core';
import { Task } from './task.model';

/** Compact task card used in the task selector grid. */
@Component({
  selector: 'app-task',
  template: `
    <button class="task-card" type="button" (click)="picked.emit(task())" [disabled]="locked()">
      <span class="priority" [attr.data-level]="task().priority">P{{ task().priority }}</span>
      <strong>{{ task().taskTitle }}</strong>
      @if (task().taskDetails) {
        <p>{{ task().taskDetails }}</p>
      }
      <small>{{ task().pomodoroMinutes }} min focus &middot; {{ doneCount() }}/{{ task().completableItems.length }} done</small>
    </button>
  `,
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  readonly task = input.required<Task>();
  readonly locked = input(false);
  readonly picked = output<Task>();

  protected doneCount(): number {
    return this.task().completableItems.filter((i) => i.done).length;
  }
}
