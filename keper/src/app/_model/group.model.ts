import {TaskModel} from './task.model';

export interface GroupModel {
  ownerId: string;
  name: string;
  uid: string;
  users: Array<string>;
  tasks: Array<TaskModel>;
}
