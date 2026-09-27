import { Injectable } from '@angular/core';
import { WorkBlock } from '../feature/work/model/work-block.model';
import { Task } from '../feature/task/task.model';

@Injectable({ providedIn: 'root' })
export class ActiveSessionService {
  workBlock: WorkBlock | null = null;
  task: Task | null = null;
}
