import {Component, Input} from '@angular/core';

@Component({
  selector: 'planner-comp',
  standalone: true,
  imports: [
  ],
  templateUrl: `./planner.component.html`,
  styleUrl: `./planner.component.scss`
})

export class PlannerComponent {
  @Input() name = '';
}