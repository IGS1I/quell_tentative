import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE } from '../../core/api';
import { Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE}task`;

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url);
  }

  get(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.url}/${id}`);
  }

  /** Tasks in a work block, highest priority first. */
  byGroup(groupId: number): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.url}/group/${groupId}`)
      .pipe(map((tasks) => tasks.sort((a, b) => b.priority - a.priority)));
  }

  save(task: Task): Observable<Task> {
    return task.uuid
      ? this.http.put<Task>(`${this.url}/${task.uuid}`, task)
      : this.http.post<Task>(this.url, task);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  toggleActive(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.url}/${id}/active`, null);
  }

  complete(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.url}/${id}/complete`, null);
  }
}
