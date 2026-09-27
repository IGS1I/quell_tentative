import { DatePipe } from '@angular/common';
import { Component, ElementRef, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, catchError, map } from 'rxjs';
import { NowService } from '../../core/now.service';
import { PomodoroComponent } from '../../feature/clock/pomodoro/pomodoro.component';
import { PomodoroSession } from '../../feature/clock/pomodoro/pomodoro-session.model';
import { PomodoroService } from '../../feature/clock/pomodoro/pomodoro.service';
import { fireConfetti } from '../../feature/reward/confetti';
import { Task } from '../../feature/task/task.model';
import { TaskService } from '../../feature/task/task.service';
import { WorkGroup } from '../../feature/work/work-group.model';
import { WorkGroupService } from '../../feature/work/work-group.service';

const REWARD_NOTES = [
  'Nice work. Stretch for a minute, you earned it.',
  'Done! Grab a glass of water or a snack.',
  'Block complete. Step outside for some fresh air.',
  'That\u2019s one off the list. Put on a song you love.',
];

/** Route: active-task/:id. Title, details, sub-points and the running Pomodoro. */
@Component({
  selector: 'app-active-task',
  imports: [DatePipe, PomodoroComponent, RouterLink],
  templateUrl: './active-task.component.html',
  styleUrl: './active-task.component.scss',
})
export class ActiveTaskComponent {
  private readonly tasks = inject(TaskService);
  private readonly workGroups = inject(WorkGroupService);
  private readonly pomodoro = inject(PomodoroService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly now = inject(NowService).now;
  protected readonly task = signal<Task | null>(null);
  protected readonly group = signal<WorkGroup | null>(null);
  protected readonly session = signal<PomodoroSession | null>(null);
  protected readonly reward = signal<string | null>(null);
  /** True once the user has confirmed and the Pomodoro is running. */
  protected readonly started = signal(false);

  private readonly startDialog = viewChild.required<ElementRef<HTMLDialogElement>>('startConfirm');
  private readonly endDialog = viewChild.required<ElementRef<HTMLDialogElement>>('endConfirm');

  constructor() {
    // Open the start confirmation as soon as the task loads (skip if resuming).
    effect(() => {
      const task = this.task();
      const started = this.started();
      if (task && !started) {
        untracked(() => this.startDialog().nativeElement.showModal());
      }
    });

    // React to route param changes so navigating between tasks reloads state.
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        takeUntilDestroyed(),
      )
      .subscribe((id) => {
        if (id) {
          // Reset signals before loading the new task.
          this.task.set(null);
          this.group.set(null);
          this.session.set(null);
          this.started.set(false);
          this.reward.set(null);
          this.load(id);
        } else {
          this.tasks.getAll().subscribe((all) => {
            const active = all.find((t) => t.isActive);
            this.router.navigate(active ? ['/active-task', active.uuid] : ['/']);
          });
        }
      });
  }

  private load(id: string): void {
    this.tasks.get(id).subscribe((task) => {
      this.task.set(task);
      this.workGroups.get(task.workGroupId).subscribe((g) => this.group.set(g));
    });
  }

  protected confirmStart(): void {
    this.startDialog().nativeElement.close();
    const task = this.task();
    if (!task) return;
    // Reset any existing session, then start fresh.
    this.pomodoro
      .start({ workGroupId: task.workGroupId, workMinutes: task.pomodoroMinutes, breakMinutes: task.breakMinutes })
      .subscribe((s) => {
        this.session.set(s);
        this.started.set(true);
      });
  }

  protected declineStart(): void {
    this.startDialog().nativeElement.close();
    const groupId = this.task()?.workGroupId;
    this.router.navigate(groupId ? ['/task-selector', groupId] : ['/']);
  }

  protected toggleItem(index: number): void {
    const task = this.task();
    if (!task) return;
    const updated: Task = {
      ...task,
      completableItems: task.completableItems.map((item, i) => (i === index ? { ...item, done: !item.done } : item)),
    };
    this.task.set(updated);
    this.tasks.save(updated).subscribe({ error: () => this.task.set(task) });
  }

  protected askToEnd(): void {
    this.endDialog().nativeElement.showModal();
  }

  protected cancelEnd(): void {
    this.endDialog().nativeElement.close();
  }

  protected endTask(): void {
    this.endDialog().nativeElement.close();
    const task = this.task();
    if (!task?.uuid) return;
    // Best-effort stop, then complete the task regardless.
    this.pomodoro.stop().pipe(catchError(() => EMPTY)).subscribe();
    this.tasks.complete(task.uuid).subscribe(async () => {
      this.session.set(null);
      this.reward.set(REWARD_NOTES[Math.floor(Math.random() * REWARD_NOTES.length)]);
      await fireConfetti();
      setTimeout(() => this.router.navigate(['/']), 1500);
    });
  }
}
