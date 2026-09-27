import { HttpErrorResponse } from '@angular/common/http';
import { Directive, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

/** Shared submit flow for the work block and task creation forms. */
@Directive()
export abstract class CreationFormBase<T> {
  protected abstract readonly form: FormGroup;

  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected abstract toPayload(): T;
  protected abstract persist(payload: T): Observable<T>;
  protected abstract onSaved(saved: T): void;

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    this.persist(this.toPayload()).subscribe({
      next: (saved) => {
        this.saving.set(false);
        this.onSaved(saved);
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        const message = err.error?.message ?? err.error?.reason ?? err.statusText;
        this.error.set(message || 'Could not save. Is the backend running on port 8080?');
      },
    });
  }
}
