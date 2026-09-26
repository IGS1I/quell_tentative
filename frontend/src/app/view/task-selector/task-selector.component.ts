import {Component, Input} from '@angular/core';

@Component({
  selector: 'task-selector-comp',
  standalone: true,
  imports: [
  ],
  templateUrl: `./task-selector.component.html`,
  styleUrl: `./task-selector.component.scss`
})

export class TaskSelectorComponent {
  @Input() name = '';
}