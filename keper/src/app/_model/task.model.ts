import {DaysEnum} from '../_enum';
import {UserModel} from './user.model';

export interface TaskModel {
  name: string;
  schedule: Array<string>;
  group: string;
  days?: Array<DaysEnum>;
  uid?: string;
  users?: Array<UserModel>;
  user?: UserModel;
}

export interface TasksByDateModel {
  date: {
    fullDate: string;
    monthDay: number;
    weekday: DaysEnum;
  };
  tasks: Array<TaskModel>;
}
