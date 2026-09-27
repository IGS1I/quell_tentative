import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_BASE } from '../../core/api';
import { dayOfWeek, isoDate, toMinutes } from '../../core/time';
import { DayOfWeek, WorkGroup } from './work-group.model';

@Injectable({ providedIn: 'root' })
export class WorkGroupService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE}group`;

  readonly groups = signal<WorkGroup[]>([]);

  load(): void {
    this.http.get<WorkGroup[]>(this.url).subscribe((groups) => this.groups.set(groups));
  }

  get(id: number): Observable<WorkGroup> {
    return this.http.get<WorkGroup>(`${this.url}/${id}`);
  }

  save(group: WorkGroup): Observable<WorkGroup> {
    const request = group.id
      ? this.http.put<WorkGroup>(`${this.url}/${group.id}`, group)
      : this.http.post<WorkGroup>(this.url, group);
    return request.pipe(tap(() => this.load()));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(tap(() => this.load()));
  }

  /** Active blocks scheduled on the given date, earliest first. */
  static onDate(groups: WorkGroup[], date: Date): WorkGroup[] {
    const day = dayOfWeek(date);
    const iso = isoDate(date);
    return groups
      .filter((g) => g.active !== false)
      .filter((g) => (g.recurring ? g.daysOfWeek.includes(day as DayOfWeek) : g.scheduledDate === iso))
      .sort((a, b) => toMinutes(a.startClockTime) - toMinutes(b.startClockTime));
  }
}
