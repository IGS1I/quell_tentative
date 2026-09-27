import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {WorkBlock} from './model/work-block.model';

@Injectable({providedIn: 'root'})
export class WorkGroupService {

  private readonly baseUrl = 'http://localhost:8080/api/group';

  constructor(private http: HttpClient) {}

  getAll(): Observable<WorkBlock[]> {
    return this.http.get<WorkBlock[]>(this.baseUrl);
  }
}
