import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {TaskModel} from '../../_model';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor() { }

  public getTodayTasks(): Observable<Array<TaskModel>> {
    return of([
      {
        name: 'Cooking',
        schedule: ['12:30 P.M.'],
        users: [
          {
            id: '1',
            name: 'Gustavo',
          }
        ]
      },
      {
        name: 'Do the dishes',
        schedule: ['7:30 P.M.'],
        users: [
          {
            id: '2',
            name: 'Rachel',
          }
        ]
      },
      {
        name: 'Take out the trash',
        schedule: ['8:00 P.M.'],
        users: [
          {
            id: '3',
            name: 'Nestor',
          }
        ]
      }
    ]);
  }
}
