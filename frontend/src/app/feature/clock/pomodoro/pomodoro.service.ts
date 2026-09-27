import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { API_BASE } from '../../../core/api';
import { PomodoroSession, PomodoroStart } from './pomodoro-session.model';

@Injectable({ providedIn: 'root' })
export class PomodoroService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE}pomodoro`;

  start(start: PomodoroStart): Observable<PomodoroSession> {
    return this.http.post<PomodoroSession>(`${this.url}/start`, start);
  }

  stop(): Observable<void> {
    return this.http.delete<void>(this.url);
  }

  /** Emits null when no session is running (empty body or an error response). */
  active(): Observable<PomodoroSession | null> {
    return this.http.get<PomodoroSession | null>(`${this.url}/active`).pipe(catchError(() => of(null)));
  }
}
