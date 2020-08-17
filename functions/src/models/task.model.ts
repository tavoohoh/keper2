import {UserModel} from './user.model';
import {DayEnum} from '../enums/day.enum';
import {DbDocumentModel} from "./db-document.model";

export class TaskModel {
  uid: string;
  name: string;
  schedule: Array<string>;
  users: Array<string | UserModel>;
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
