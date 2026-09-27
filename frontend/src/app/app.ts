import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlarmSchedulerService } from './feature/reward/alarm-scheduler.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  constructor() {
    // Eagerly instantiate so block-start/end alarms are active for the app's lifetime.
    inject(AlarmSchedulerService);
  }
}
