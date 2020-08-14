import {UserModel} from './user.model';
import {TaskModel} from './task.model';

export interface GroupModel {
  readonly name: string;
  readonly uid?: string;
}

export interface FullGroupModel extends GroupModel {
  readonly users: Array<UserModel>;
  readonly tasks: Array<TaskModel>;
}
