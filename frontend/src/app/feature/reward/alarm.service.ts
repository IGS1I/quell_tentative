import { Injectable, signal } from '@angular/core';
import { playAlarm } from './alarm';

const KEY = 'quell_alarm_enabled';
const REPEAT_MS = 3_000;

@Injectable({ providedIn: 'root' })
export class AlarmService {
  readonly enabled = signal(localStorage.getItem(KEY) !== 'false');
  readonly ringing = signal(false);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  toggle(): void {
    this.enabled.update((v) => {
      const next = !v;
      localStorage.setItem(KEY, String(next));
      return next;
    });
  }

  /** Start repeating alarm. Respects the enabled flag. */
  play(): void {
    if (!this.enabled()) return;
    // Clear any existing loop before starting a new one.
    this.clearInterval();
    this.ringing.set(true);
    playAlarm();
    this.intervalId = setInterval(() => playAlarm(), REPEAT_MS);
  }

  /** Stop the repeating alarm explicitly. */
  stop(): void {
    this.ringing.set(false);
    this.clearInterval();
  }

  /** Always plays once — used by the "Test alarm" button in settings. */
  preview(): void {
    playAlarm();
  }

  private clearInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
