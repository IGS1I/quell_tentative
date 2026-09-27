import { Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { NowService } from '../../../core/now.service';
import { AlarmService } from '../../reward/alarm.service';
import { PomodoroSession } from './pomodoro-session.model';

const SNOOZE_MINUTES = 5;

/** Countdown progress bar for the running Pomodoro. Shows a snooze button once time is up. */
@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrl: './pomodoro.component.scss',
})
export class PomodoroComponent {
  readonly session = input.required<PomodoroSession>();
  readonly timeUp = output<void>();

  protected readonly snoozeMinutes = SNOOZE_MINUTES;
  private readonly now = inject(NowService).now;
  protected readonly alarmService = inject(AlarmService);
  private readonly snoozed = signal(0);

  protected readonly totalMinutes = computed(() => this.session().workMinutes + this.snoozed());

  private readonly remainingMs = computed(() => {
    const end = new Date(this.session().startedAt).getTime() + this.totalMinutes() * 60_000;
    return Math.max(0, end - this.now().getTime());
  });

  protected readonly remainingPercent = computed(() => (this.remainingMs() / (this.totalMinutes() * 60_000)) * 100);
  protected readonly finished = computed(() => this.remainingMs() === 0);

  protected readonly remainingLabel = computed(() => {
    const s = Math.ceil(this.remainingMs() / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} left`;
  });

  constructor() {
    // Cue: chime once each time the countdown reaches zero.
    effect(() => {
      if (this.finished()) {
        untracked(() => {
          this.alarmService.play();
          this.timeUp.emit();
        });
      }
    });
  }

  protected snooze(): void {
    this.alarmService.stop();
    this.snoozed.update((m) => m + SNOOZE_MINUTES);
  }
}
