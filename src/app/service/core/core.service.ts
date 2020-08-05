import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {TaskModel} from '../../_model';
import {DaysEnum} from '../../_enum';
import {UserModel} from '../../_model/user.model';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(
    private translateService: TranslateService
  ) {}

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

  public async listTasks(): Promise<Array<TaskModel>> {
    await setTimeout(null, 1000);

    return [
      {
        name: 'Cooking',
        schedule: ['12:30 P.M.'],
        users: [
          {
            id: 'uVn3URVzCKXYd1BB84GACilUNet1',
            name: 'Gustavo',
          },
          {
            id: 'B84GACilUNet1uVn3URVzCKXYd1B',
            name: 'Rachel',
          },
          {
            id: 'B84GACKXYd1BCilUNet1uVn3URVz',
            name: 'Nestor',
          }
        ],
        days: [
          DaysEnum.MON,
          DaysEnum.TUE,
          DaysEnum.WEN,
          DaysEnum.THU,
          DaysEnum.FRI,
          DaysEnum.SAT,
          DaysEnum.SUN
        ]
      },
      {
        name: 'Do the dishes',
        schedule: ['7:30 P.M.'],
        users: [
          {
            id: 'uVn3URVzCKXYd1BB84GACilUNet1',
            name: 'Gustavo',
          },
          {
            id: 'B84GACilUNet1uVn3URVzCKXYd1B',
            name: 'Rachel',
          },
          {
            id: 'B84GACKXYd1BCilUNet1uVn3URVz',
            name: 'Nestor',
          }
        ],
        days: [
          DaysEnum.MON,
          DaysEnum.TUE,
          DaysEnum.WEN,
          DaysEnum.THU,
          DaysEnum.FRI,
          DaysEnum.SAT,
          DaysEnum.SUN
        ]
      },
      {
        name: 'Take out the trash',
        schedule: ['8:00 P.M.'],
        users: [
          {
            id: 'uVn3URVzCKXYd1BB84GACilUNet1',
            name: 'Gustavo',
          },
          {
            id: 'B84GACilUNet1uVn3URVzCKXYd1B',
            name: 'Rachel',
          },
          {
            id: 'B84GACKXYd1BCilUNet1uVn3URVz',
            name: 'Nestor',
          }
        ],
        days: [
          DaysEnum.MON,
          DaysEnum.WEN,
          DaysEnum.FRI
        ]
      }
    ];
  }

  public async listUsers(): Promise<Array<UserModel>> {
    await setTimeout(null, 1000);

    return [
      {
        id: 'uVn3URVzCKXYd1BB84GACilUNet1',
        name: 'Gustavo',
      },
      {
        id: 'B84GACilUNet1uVn3URVzCKXYd1B',
        name: 'Rachel',
      },
      {
        id: 'B84GACKXYd1BCilUNet1uVn3URVz',
        name: 'Nestor',
      }
    ];
  }
}
