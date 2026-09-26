import { Routes } from '@angular/router';
import { StartComponent } from './view/start/start.component';
import { PlannerComponent } from './view/planner/planner.component';
import { ActiveTaskComponent } from './view/active-task/active-task.component';
import { TaskSelectorComponent } from './view/task-selector/task-selector.component';

export const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'planner', component: PlannerComponent },
  { path: 'active-task', component: ActiveTaskComponent },
  { path: 'task-selector', component: TaskSelectorComponent }
];
