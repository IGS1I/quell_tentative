import { Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { NowService } from '../../../core/now.service';
import { AlarmService } from '../../reward/alarm.service';
import { PomodoroSession, PomodoroState } from './pomodoro-session.model';

/** Countdown timer that cycles work → break → work → break … until the task is ended. */
@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrl: './pomodoro.component.scss',
})
export class PomodoroComponent {
  readonly session = input.required<PomodoroSession>();
  readonly timeUp = output<void>();

  private readonly now = inject(NowService).now;
  protected readonly alarmService = inject(AlarmService);

  /** Current phase: WORK or BREAK. */
  protected readonly phase = signal<PomodoroState>('WORK');
  /** Epoch ms when the current phase started. */
  private readonly phaseStart = signal(0);
  /** How many full work cycles have completed. */
  protected readonly cycle = signal(1);
  /** True while waiting for user to confirm the next phase. */
  protected readonly waiting = signal(false);

  protected readonly phaseMinutes = computed(() =>
    this.phase() === 'WORK' ? this.session().workMinutes : this.session().breakMinutes,
  );

  private readonly remainingMs = computed(() => {
    const end = this.phaseStart() + this.phaseMinutes() * 60_000;
    return Math.max(0, end - this.now().getTime());
  });

  protected readonly remainingPercent = computed(() =>
    this.phaseMinutes() > 0 ? (this.remainingMs() / (this.phaseMinutes() * 60_000)) * 100 : 0,
  );
  protected readonly finished = computed(() => this.remainingMs() === 0);

  protected readonly remainingLabel = computed(() => {
    const s = Math.ceil(this.remainingMs() / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} left`;
  });

  constructor() {
    // Reset everything when a new session is provided.
    effect(() => {
      const session = this.session();
      untracked(() => {
        this.phase.set('WORK');
        this.phaseStart.set(new Date(session.startedAt).getTime());
        this.cycle.set(1);
        this.waiting.set(false);
      });
    });

    // Chime when the current phase countdown reaches zero.
    effect(() => {
      if (this.finished() && !this.waiting()) {
        untracked(() => {
          this.alarmService.play();
          this.waiting.set(true);
          this.timeUp.emit();
        });
      }
    });
  }

  /** User confirms — advance to the next phase. */
  protected continueToNext(): void {
    this.alarmService.stop();
    if (this.phase() === 'WORK') {
      this.phase.set('BREAK');
    } else {
      this.phase.set('WORK');
      this.cycle.update((c) => c + 1);
    }
    this.phaseStart.set(Date.now());
    this.waiting.set(false);
  }
}
