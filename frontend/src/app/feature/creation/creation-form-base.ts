import {Component, inject, output, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface FormSubmission<T> {
  data: T;
}

@Component({
  template: '',
})
export abstract class CreationFormBase<T> {
  private readonly http = inject(HttpClient);

  abstract readonly endpoint: string;

  readonly submitted = output<FormSubmission<T>>();

  readonly name = signal('');
  readonly description = signal('');

  abstract onSubmit(): void;

  protected submit(data: T): void {
    this.http.post(this.endpoint, data).subscribe();
    this.submitted.emit({ data });
  }
}
