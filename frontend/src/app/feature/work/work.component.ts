import {Component, Input} from '@angular/core';
import {NgFor} from '@angular/common';

@Component({
  selector: 'work-comp',
  standalone: true,
  imports: [NgFor],
  // you can have the template call a separate HTML file
  templateUrl: `./work.component.html`
})
export class WorkComponent {
  @Input() name = '';
  // TODO: make a basic DTO on what represents a work task on the FE
  @Input() taskTitles = ["", "", ""];

  constructor() {}
}
