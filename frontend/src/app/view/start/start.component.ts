import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NowService } from '../../core/now.service';
import { toMinutes } from '../../core/time';
import { ClockComponent } from '../../feature/clock/clock.component';
import { AlarmService } from '../../feature/reward/alarm.service';
import { WorkComponent } from '../../feature/work/work.component';
import { WorkGroupService } from '../../feature/work/work-group.service';

/** Home: clock, the next three work blocks today, and nav. */
@Component({
  selector: 'app-start',
  imports: [ClockComponent, WorkComponent, RouterLink],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent {
  private readonly groupService = inject(WorkGroupService);
  private readonly now = inject(NowService).now;
  protected readonly alarm = inject(AlarmService);

  protected readonly nowMinutes = computed(() => this.now().getHours() * 60 + this.now().getMinutes());

  /** Only three blocks, per the design: the current one and what's next today. */
  protected readonly blocks = computed(() =>
    WorkGroupService.onDate(this.groupService.groups(), this.now())
      .filter((g) => toMinutes(g.endClockTime) > this.nowMinutes())
      .slice(0, 3),
  );

  constructor() {
    this.groupService.load();
  }
}
