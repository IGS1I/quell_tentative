import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NowService } from '../../core/now.service';
import { isoDate } from '../../core/time';
import { WorkGroup } from '../../feature/work/work-group.model';
import { WorkGroupService } from '../../feature/work/work-group.service';

/** Week overview (Mon-Sun) of every scheduled work block. */
@Component({
  selector: 'app-planner',
  imports: [DatePipe, RouterLink],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.scss',
})
export class PlannerComponent {
  private readonly groupService = inject(WorkGroupService);
  private readonly now = inject(NowService).now;

  /** 0 = this week, -1 = last week, 1 = next week. */
  protected readonly weekOffset = signal(0);
  protected readonly today = isoDate(new Date());

  protected blockIsNow(block: WorkGroup, dayIso: string): boolean {
    if (dayIso !== this.today) return false;
    const [sh, sm] = block.startClockTime.split(':').map(Number);
    const [eh, em] = block.endClockTime.split(':').map(Number);
    const n = this.now();
    const nowMin = n.getHours() * 60 + n.getMinutes();
    return nowMin >= sh * 60 + sm && nowMin < eh * 60 + em;
  }

  protected readonly days = computed(() => {
    const monday = new Date();
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7) + this.weekOffset() * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return { date, iso: isoDate(date), blocks: WorkGroupService.onDate(this.groupService.groups(), date) };
    });
  });

  constructor() {
    this.groupService.load();
  }
}
