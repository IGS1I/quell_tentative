import { Routes } from '@angular/router';
import { WorkScheduleFormComponent } from './feature/creation/work-schedule-form/work-schedule-form.component';
import { TaskFormComponent } from './feature/creation/task-form/task-form.component';
import { ActiveTaskComponent } from './view/active-task/active-task.component';
import { PlannerComponent } from './view/planner/planner.component';
import { SettingsComponent } from './view/settings/settings.component';
import { StartComponent } from './view/start/start.component';
import { TaskBrowserComponent } from './view/task-browser/task-browser.component';
import { TaskSelectorComponent } from './view/task-selector/task-selector.component';

export const routes: Routes = [
  { path: '', component: StartComponent, title: 'Quell' },
  { path: 'planner', component: PlannerComponent, title: 'Quell · Planner' },
  { path: 'settings', component: SettingsComponent, title: 'Quell · Settings' },
  { path: 'task-selector/:groupId', component: TaskSelectorComponent, title: 'Quell · Pick a task' },
  { path: 'task-browser/:groupId', component: TaskBrowserComponent, title: 'Quell · Tasks' },
  { path: 'active-task', component: ActiveTaskComponent, title: 'Quell · Focus' },
  { path: 'active-task/:id', component: ActiveTaskComponent, title: 'Quell · Focus' },
  { path: 'create/task/:id', component: TaskFormComponent, title: 'Quell · New task' },
  { path: 'create/work', component: WorkScheduleFormComponent, title: 'Quell · New work block' },
  { path: 'edit/task/:uuid', component: TaskFormComponent, title: 'Quell · Edit task' },
  { path: 'edit/work/:id', component: WorkScheduleFormComponent, title: 'Quell · Edit work block' },
  // Dev test routes
  { path: 'task-create-test', component: TaskFormComponent },
  { path: 'work-create-test', component: WorkScheduleFormComponent },
  { path: '**', redirectTo: '' },
];
