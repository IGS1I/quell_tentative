import {Component, Input} from '@angular/core';

@Component({
  selector: 'pomodoro-comp',
  standalone: true,
  // you can have the template call a separate HTML file
  templateUrl: `./pomodoro.component.html`
})
export class PomodoroComponent {
  @Input() name = '';

  isRunning = false;
  start() {
    // TODO: set this based off status of work block
    // TODO: we need to set a backend that just holds the active work block id and
    //  the pomodoro start and end time
    this.isRunning = true;
  }


  getTimeAllocated() {
    return ;
  }
}
