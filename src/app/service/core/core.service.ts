import {Injectable} from '@angular/core';
import {TaskModel} from '../../_model';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  public async getTodayTasks(date: Date): Promise<Array<TaskModel>> {
    await setTimeout(null, 1000);

    return [
      {
        name: 'Cooking',
        schedule: ['12:30 P.M.'],
        users: [
          {
            id: 'uVn3URVzCKXYd1BB84GACilUNet1',
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
    ];
  }
}
