import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CreationFormBase} from '../creation-form-base';

export interface TaskFormData {
  name: string;
  description: string;
}

@Component({
  selector: 'task-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent extends CreationFormBase<TaskFormData> {
  override endpoint: string = 'http://localhost:8080/api/task';
  onSubmit(): void {
    this.submit({
      name: this.name(),
      description: this.description(),
    });
  }
}
