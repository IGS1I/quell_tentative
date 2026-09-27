import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkGroup } from './work-group.model';

/** One work block on the start screen; tapping it opens its task selector. */
@Component({
  selector: 'app-work',
  imports: [RouterLink],
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss',
})
export class WorkComponent {
  readonly group = input.required<WorkGroup>();
  /** Current time as minutes since midnight. */
  readonly nowMinutes = input(0);

  protected readonly isNow = computed(() => {
    const [sh, sm] = this.group().startClockTime.split(':').map(Number);
    const [eh, em] = this.group().endClockTime.split(':').map(Number);
    const now = this.nowMinutes();
    return now >= sh * 60 + sm && now < eh * 60 + em;
  });
}
