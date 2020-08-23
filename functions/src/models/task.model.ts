import {KpUserModel, UserModel} from './user.model';
import {DayModel} from './day.model';
import {DayEnum} from '../enums/day.enum';
import {DbDocumentModel} from './db-document.model';

export class TaskModel {
  uid: string;
  name: string;
  schedule: Array<string>;
  users: Array<UserModel> | string;
  group: string;
  days: Array<DayEnum>;

  constructor(props: DbDocumentModel | any) {
    this.uid = props.id || props.uid;
    this.name = props.data().name || props.name || '';
    this.schedule = props.data().schedule || props.schedule || [];
    this.group = props.data().group || props.group || '';
    this.users = props.data().users || props.users || [];
    this.days = props.data().days || props.days || [];
  }
}

export class DateTaskModel {
  uid: string;
  name: string;
  schedule: Array<string>;
  user: string;
  group: string;

  constructor(props: DbDocumentModel, user: KpUserModel) {
    this.uid = props.id;
    this.name = props.data().name;
    this.schedule = props.data().schedule;
    this.group = props.data().group;
    this.user = user.displayName || '';
  }
}

export interface DateTasksModel {
  date: DayModel;
  tasks: Array<DateTaskModel>;
}
