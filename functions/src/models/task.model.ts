import {UserModel} from './user.model';
import {DayEnum} from '../enums/day.enum';

export interface TaskModel {
  name: string;
  schedule: Array<string>;
  users: Array<string | UserModel>;
  group: string;
  days: Array<DayEnum>;
}
