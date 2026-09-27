import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlarmSchedulerService } from './feature/reward/alarm-scheduler.service';
import { KeyboardComponent } from './feature/keyboard/keyboard.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, KeyboardComponent],
  template: '<router-outlet /><app-keyboard />',
})
export class App {
  constructor() {
    // Eagerly instantiate so block-start/end alarms are active for the app's lifetime.
    inject(AlarmSchedulerService);
  }
}
