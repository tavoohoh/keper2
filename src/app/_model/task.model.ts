import { DaysEnum } from '../_enum';
import { UserModel } from './user.model';

export interface TaskModel {
  name: string;
  schedule: Array<string>;
  days: Array<DaysEnum>;
  users: Array<UserModel>;
}
