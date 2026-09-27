import { Routes } from '@angular/router';
import { StartComponent } from './view/start/start.component';
import { PlannerComponent } from './view/planner/planner.component';
import { ActiveTaskComponent } from './view/active-task/active-task.component';
import { TaskSelectorComponent } from './view/task-selector/task-selector.component';
import {TaskFormComponent} from './feature/creation/task-form/task-form.component';
import {WorkScheduleFormComponent} from './feature/creation/work-schedule-form/work-schedule-form.component';

export const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'planner', component: PlannerComponent },
  // TODO: this is just a test, remove later
  { path: 'task-create-test', component: TaskFormComponent },
  { path: 'work-create-test', component: WorkScheduleFormComponent },
  { path: 'active-task', component: ActiveTaskComponent },
  { path: 'task-selector', component: TaskSelectorComponent },

  { path: "create/task/:id", component: TaskFormComponent, pathMatch: "full" },
];
