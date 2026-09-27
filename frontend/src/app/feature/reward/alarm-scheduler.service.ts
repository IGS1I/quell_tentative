import { Injectable, effect, inject } from '@angular/core';
import { NowService } from '../../core/now.service';
import { toMinutes } from '../../core/time';
import { WorkGroupService } from '../work/work-group.service';
import { AlarmService } from './alarm.service';

/**
 * Watches the clock and fires the alarm chime whenever a work block
 * starts or ends. Instantiated once at app startup via AppComponent.
 */
@Injectable({ providedIn: 'root' })
export class AlarmSchedulerService {
  private readonly alarm = inject(AlarmService);
  private readonly groups = inject(WorkGroupService).groups;
  private readonly now = inject(NowService).now;

  /** Tracks which alarms have fired today so we ring once per event. */
  private readonly fired = new Set<string>();
  private lastDay = -1;

  constructor() {
    effect(() => {
      const t = this.now();
      const day = t.getDate();
      if (day !== this.lastDay) {
        this.fired.clear();
        this.lastDay = day;
      }
      const mins = t.getHours() * 60 + t.getMinutes();
      for (const g of WorkGroupService.onDate(this.groups(), t)) {
        this.checkFire(`${g.id}-start`, toMinutes(g.startClockTime), mins);
        this.checkFire(`${g.id}-end`, toMinutes(g.endClockTime), mins);
      }
    });
  }

  private checkFire(key: string, threshold: number, mins: number): void {
    if (mins === threshold && !this.fired.has(key)) {
      this.fired.add(key);
      this.alarm.play();
    }
  }
}
