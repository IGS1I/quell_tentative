import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { isoDate } from '../../../core/time';
import { DAYS_OF_WEEK, DayOfWeek, WorkGroup } from '../../work/work-group.model';
import { WorkGroupService } from '../../work/work-group.service';
import { CreationFormBase } from '../creation-form-base';

/** Route: create/work (create) or edit/work/:id (edit). */
@Component({
  selector: 'app-work-schedule-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './work-schedule-form.component.html',
  styleUrl: '../creation-form.scss',
})
export class WorkScheduleFormComponent extends CreationFormBase<WorkGroup> {
  private readonly groups = inject(WorkGroupService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly days = DAYS_OF_WEEK;
  /** Group ID when editing; null when creating. */
  protected readonly editId = signal<number | null>(null);

  protected readonly form = new FormGroup({
    groupName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    groupDescription: new FormControl('', { nonNullable: true }),
    recurring: new FormControl(true, { nonNullable: true }),
    daysOfWeek: new FormControl<DayOfWeek[]>(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], { nonNullable: true }),
    startClockTime: new FormControl('09:00', { nonNullable: true, validators: [Validators.required] }),
    endClockTime: new FormControl('11:00', { nonNullable: true, validators: [Validators.required] }),
    scheduledDate: new FormControl(isoDate(new Date()), { nonNullable: true }),
  });

  constructor() {
    super();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.editId.set(id);
      this.groups.get(id).subscribe((group) => {
        this.form.patchValue({
          groupName: group.groupName,
          groupDescription: group.groupDescription ?? '',
          recurring: group.recurring,
          daysOfWeek: group.daysOfWeek as DayOfWeek[],
          startClockTime: group.startClockTime,
          endClockTime: group.endClockTime,
          scheduledDate: group.scheduledDate ?? isoDate(new Date()),
        });
      });
    }
  }

  protected toggleDay(day: DayOfWeek): void {
    const current = this.form.controls.daysOfWeek.value;
    this.form.controls.daysOfWeek.setValue(
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day],
    );
  }

  protected toPayload(): WorkGroup {
    const v = this.form.getRawValue();
    return {
      id: this.editId() ?? undefined,
      groupName: v.groupName.trim(),
      groupDescription: v.groupDescription.trim(),
      recurring: v.recurring,
      daysOfWeek: v.recurring ? v.daysOfWeek : [],
      startClockTime: v.startClockTime,
      endClockTime: v.endClockTime,
      scheduledDate: v.recurring ? null : v.scheduledDate,
    };
  }

  protected persist(payload: WorkGroup): Observable<WorkGroup> {
    return this.groups.save(payload);
  }

  protected onSaved(): void {
    this.router.navigate([this.editId() ? '/settings' : '/']);
  }

  protected deleteGroup(): void {
    const id = this.editId();
    if (!id || !confirm('Delete this work block?')) return;
    this.groups.delete(id).subscribe(() => this.router.navigate(['/settings']));
  }
}
