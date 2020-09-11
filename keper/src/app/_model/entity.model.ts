import {TaskModel} from './task.model';
import {MemberModel} from './member.model';
import {GroupModel} from './group.model';

export class EntityModel {
  name: string;
  uid: string;
  value?: TaskModel | MemberModel | GroupModel;

  constructor(name: string, uid: string, value: TaskModel | MemberModel | GroupModel = null) {
    this.name = name;
    this.uid = uid;
    this.value = value;
  }
}
