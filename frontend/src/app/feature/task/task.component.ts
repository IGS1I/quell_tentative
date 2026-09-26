import {Component, Input} from '@angular/core';

@Component({
  selector: 'task-comp',
  standalone: true,
  // you can have the template call a seperate HTML file
  templateUrl: `./task.component.html`
})
export class TaskComponent {
  @Input() name = '';
}
