import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {TranslateService} from '@ngx-translate/core';
import {TaskModel, TasksByDateModel} from '../../_model';
import {DaysEnum} from '../../_enum';
import {UserModel} from '../../_model/user.model';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

const API_URL = `${environment.api}tasks`;

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(
    private translateService: TranslateService,
    private http: HttpClient
  ) {}

  public getTodayTasks(date: Date): Observable<TasksByDateModel> {
    const params = new HttpParams().set('groupId', 'xkw1cy7qPSe78tVUREUG').set('date', date.toLocaleDateString());

    return this.http.get<TasksByDateModel>(API_URL, {headers: this.headers, params});
  }

  public async listTasks() {
    await setTimeout(null, 1000);

    // return [
    //   {
    //     name: 'Cooking',
    //     schedule: ['12:30'],
    //     users: [
    //       {
    //         id: 'uVn3URVzCKXYd1BB84GACilUNet1',
    //         name: 'Gustavo',
    //       },
    //       {
    //         id: 'B84GACKXYd1BCilUNet1uVn3URVz',
    //         name: 'Nestor',
    //       }
    //     ],
    //     days: [
    //       DaysEnum.MON,
    //       DaysEnum.TUE,
    //       DaysEnum.WEN,
    //       DaysEnum.THU,
    //       DaysEnum.FRI,
    //       DaysEnum.SAT,
    //       DaysEnum.SUN
    //     ]
    //   },
    //   {
    //     name: 'Do the dishes',
    //     schedule: ['07:30'],
    //     users: [
    //       {
    //         id: 'uVn3URVzCKXYd1BB84GACilUNet1',
    //         name: 'Gustavo',
    //       },
    //       {
    //         id: 'B84GACilUNet1uVn3URVzCKXYd1B',
    //         name: 'Rachel',
    //       },
    //       {
    //         id: 'B84GACKXYd1BCilUNet1uVn3URVz',
    //         name: 'Nestor',
    //       }
    //     ],
    //     days: [
    //       DaysEnum.MON,
    //       DaysEnum.TUE,
    //       DaysEnum.WEN,
    //       DaysEnum.THU,
    //       DaysEnum.FRI,
    //       DaysEnum.SAT,
    //       DaysEnum.SUN
    //     ]
    //   },
    //   {
    //     name: 'Take out the trash',
    //     schedule: ['08:00'],
    //     users: [
    //       {
    //         id: 'uVn3URVzCKXYd1BB84GACilUNet1',
    //         name: 'Gustavo',
    //       },
    //       {
    //         id: 'B84GACilUNet1uVn3URVzCKXYd1B',
    //         name: 'Rachel',
    //       },
    //       {
    //         id: 'B84GACKXYd1BCilUNet1uVn3URVz',
    //         name: 'Nestor',
    //       }
    //     ],
    //     days: [
    //       DaysEnum.MON,
    //       DaysEnum.WEN,
    //       DaysEnum.FRI
    //     ]
    //   }
    // ];
  }

  public async listUsers(): Promise<Array<UserModel>> {
    await setTimeout(null, 1000);

    return [];
  }
}
