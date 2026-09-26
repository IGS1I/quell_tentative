import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TaskComponent} from './feature/task/task.component';
import {StartComponent} from './view/start/start.component';
import { ActiveTaskComponent } from './view/active-task/active-task.component';
import { PlannerComponent } from './view/planner/planner.component';
import { TaskSelectorComponent } from './view/task-selector/task-selector.component';

@Component({
  imports: [RouterOutlet, TaskComponent, StartComponent, PlannerComponent, ActiveTaskComponent, TaskSelectorComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
