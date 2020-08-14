import {UserModel} from './user.model';
import {DayEnum} from '../enums/day.enum';

export interface TaskModel {
  name: string;
  schedule: Array<string>;
  users: Array<UserModel>;
  days?: Array<DayEnum>;
}
