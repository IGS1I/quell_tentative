import {Component, Input, OnInit, signal} from '@angular/core';
import {AnalogClock} from '@myangularapps/analog-clock';
import {WorkComponent} from '../../feature/work/work.component';
import {WorkBlock} from '../../feature/work/model/work-block.model';
import {WorkGroupService} from '../../feature/work/work-group.service';

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
export class StartComponent implements OnInit {

  workBlocks = signal<WorkBlock[]>([]);

  @Input() name = '';

  constructor(private workGroupService: WorkGroupService) {}

  ngOnInit(): void {
    this.workGroupService.getAll().subscribe(blocks => {
      this.workBlocks.set(blocks);
    });
  }

  protected readonly Date = Date;
}
