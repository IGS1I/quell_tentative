import {Component, inject, output, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface FormSubmission<T> {
  data: T;
}

export enum FormMode {
  Create,
  Update,
}

@Component({
  template: '',
})
export abstract class CreationFormBase<T> {
  public http = inject(HttpClient);

  abstract readonly endpoint: string;

  readonly submitted = output<FormSubmission<T>>();

  readonly name = signal('');
  readonly description = signal('');

  abstract onSubmit(): void;

  protected submit(data: T, mode: FormMode = FormMode.Create): void {
    switch (mode) {
      case FormMode.Create:
        this.http.post(this.endpoint, data).subscribe();
        break;
      case FormMode.Update:
        this.http.put(this.endpoint, data).subscribe();
        break;
    }
    this.submitted.emit({ data });
  }
}
