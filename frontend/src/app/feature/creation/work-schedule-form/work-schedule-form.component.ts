import {Component, computed, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CreationFormBase} from '../creation-form-base';

export interface WorkScheduleFormData {
  groupName: string;
  groupDescription: string;
  recurring: boolean;
  daysOfWeek: string[];
  startClockTime: string;
  endClockTime: string;
  scheduledDate: string;
}

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

@Component({
  selector: 'work-schedule-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './work-schedule-form.component.html'
})
export class WorkScheduleFormComponent extends CreationFormBase<WorkScheduleFormData> {
  override endpoint: string = 'http://localhost:8080/api/group';
  recurring = signal(false);
  selectedDays = signal<string[]>([]);
  startClockTime = signal('');
  endClockTime = signal('');
  scheduledDate = signal('');

  readonly isNextDay = computed(() => {
    const start = this.startClockTime();
    const end = this.endClockTime();
    return start !== '' && end !== '' && end <= start;
  });

  readonly days = DAYS;

  toggleDay(day: string): void {
    const current = this.selectedDays();
    if (current.includes(day)) {
      this.selectedDays.set(current.filter(d => d !== day));
    } else {
      this.selectedDays.set([...current, day]);
    }
  }

  isDaySelected(day: string): boolean {
    return this.selectedDays().includes(day);
  }

  onSubmit(): void {
    this.submit({
      groupName: this.name(),
      groupDescription: this.description(),
      recurring: this.recurring(),
      daysOfWeek: this.selectedDays(),
      startClockTime: this.startClockTime(),
      endClockTime: this.endClockTime(),
      scheduledDate: this.scheduledDate(),
    });
  }
}
