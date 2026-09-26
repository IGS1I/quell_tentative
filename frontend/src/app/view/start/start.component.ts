import {Component, Input} from '@angular/core';
import {AnalogClock} from '@myangularapps/analog-clock';
import {WorkComponent} from '../../feature/work/work.component';
import {WorkBlock} from '../../feature/work/dto/work-block.model';

@Component({
  selector: 'start-comp',
  standalone: true,
  imports: [
    AnalogClock,
    WorkComponent
  ],
  templateUrl: `./start.component.html`,
  styleUrl: `./start.component.scss`
})
export class StartComponent {

  workBlocks: WorkBlock[] = [
    new WorkBlock('test title 1', ["test12", "test22", "test13"]),
    new WorkBlock('test title 2', ["test1212", "tes42t22", "t12est13"])

  ];

  @Input() name = '';
}
