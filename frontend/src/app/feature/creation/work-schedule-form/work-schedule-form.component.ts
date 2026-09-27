import {Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CreationFormBase, FormMode} from '../creation-form-base';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';

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


  readonly taskIdInURL: string | null;
  private route = inject(ActivatedRoute);

  constructor() {
    super();
    this.taskIdInURL = this.route.snapshot.paramMap.get('id');

    if (this.taskIdInURL != null) {
      // pull the API and fill the form
      super['http'].get<WorkScheduleFormData>(`http://localhost:8080/api/group/${this.taskIdInURL}`).subscribe(data => {
        this.name.set(data.groupName);
        this.description.set(data.groupDescription);
        this.recurring.set(data.recurring);
        this.selectedDays.set(data.daysOfWeek);
        this.startClockTime.set(data.startClockTime);
        this.endClockTime.set(data.endClockTime);
        this.scheduledDate.set(data.scheduledDate);
      })
    }
  }

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
    const mode = this.taskIdInURL != null ? FormMode.Update : FormMode.Create;
    if (mode === FormMode.Update) {
      this.endpoint = `http://localhost:8080/api/group/${this.taskIdInURL}`;
    }
    this.submit({
      groupName: this.name(),
      groupDescription: this.description(),
      recurring: this.recurring(),
      daysOfWeek: this.selectedDays(),
      startClockTime: this.startClockTime(),
      endClockTime: this.endClockTime(),
      scheduledDate: this.scheduledDate(),
    }, mode);
  }

  getSubmitButtonDisplay() {
    if (this.taskIdInURL != null) {
      return "Update";
    } else {
      return "Create";
    }
  }
}
