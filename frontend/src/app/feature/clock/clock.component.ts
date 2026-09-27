import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { NowService } from '../../core/now.service';

/** Analog clock with the date above and digital time below, as on the start screen sketch. */
@Component({
  selector: 'app-clock',
  imports: [DatePipe],
  template: `
    <div class="clock">
      <span class="date">{{ now() | date: 'MMM d, EEEE' }}</span>
      <svg viewBox="0 0 100 100" role="img" [attr.aria-label]="(now() | date: 'h:mm a') ?? ''">
        <circle cx="50" cy="50" r="46" class="face" />
        @for (tick of ticks; track tick) {
          <line x1="50" y1="8" x2="50" y2="13" class="tick" [attr.transform]="'rotate(' + tick * 30 + ' 50 50)'" />
        }
        <line x1="50" y1="50" x2="50" y2="26" class="hand hour" [attr.transform]="'rotate(' + hourAngle() + ' 50 50)'" />
        <line x1="50" y1="50" x2="50" y2="16" class="hand minute" [attr.transform]="'rotate(' + minuteAngle() + ' 50 50)'" />
        <line x1="50" y1="54" x2="50" y2="14" class="hand second" [attr.transform]="'rotate(' + secondAngle() + ' 50 50)'" />
        <circle cx="50" cy="50" r="2.5" class="pin" />
      </svg>
      <span class="digital">{{ now() | date: 'h:mm a' }}</span>
    </div>
  `,
  styleUrl: './clock.component.scss',
})
export class ClockComponent {
  protected readonly now = inject(NowService).now;
  protected readonly ticks = Array.from({ length: 12 }, (_, i) => i);

  protected readonly hourAngle = computed(() => (this.now().getHours() % 12) * 30 + this.now().getMinutes() * 0.5);
  protected readonly minuteAngle = computed(() => this.now().getMinutes() * 6 + this.now().getSeconds() * 0.1);
  protected readonly secondAngle = computed(() => this.now().getSeconds() * 6);
}
