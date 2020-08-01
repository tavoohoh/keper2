import { DaysEnum } from '../_enum';
import { UserModel } from './user.model';

export interface TaskModel {
  name: string;
  schedule: Array<string>;
  users: Array<UserModel>;
  days?: Array<DaysEnum>;
}
