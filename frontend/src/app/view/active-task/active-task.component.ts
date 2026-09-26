import {Component, Input} from '@angular/core';

@Component({
  selector: 'active-task-comp',
  standalone: true,
  imports: [
  ],
  templateUrl: `./active-task.component.html`,
  styleUrl: `./active-task.component.scss`
})

export class ActiveTaskComponent {
  @Input() name = '';
}
