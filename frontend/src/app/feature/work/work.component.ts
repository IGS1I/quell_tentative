import {Component, Input} from '@angular/core';
import {WorkBlock} from './model/work-block.model';

@Component({
  selector: 'work-comp',
  standalone: true,
  imports: [],
  // you can have the template call a separate HTML file
  templateUrl: `./work.component.html`
})
export class WorkComponent {
  @Input() workBlock?: WorkBlock;
}
