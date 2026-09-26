import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TaskComponent} from './feature/task/task.component';
import {StartComponent} from './view/start/start.component';

@Component({
  imports: [RouterOutlet, TaskComponent, StartComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
