import {UserModel} from './user.model';
import {TaskModel} from './task.model';
import {DbDocumentModel} from './db-document.model';

export class GroupModel {
  public ownerId: string;
  readonly name: string;
  readonly uid?: string;

  constructor(response: DbDocumentModel) {
    const groupData = response.data();

    this.ownerId = groupData.ownerId;
    this.name = groupData.name;
    this.uid = response.uid;
  }
}

export class FullGroupModel extends GroupModel {
  readonly users: Array<UserModel>;
  readonly tasks: Array<TaskModel>;

  constructor(response: DbDocumentModel) {
    super(response);

    const groupData = response.data();

    this.users = groupData.users || [];
    this.tasks = groupData.tasks || [];
  }
}
