import * as admin from 'firebase-admin';
import {CollectionEnum} from '../enums/colletion.enum';
import {DateTaskModel, TaskModel} from '../models/task.model';
import {DayEnum} from "../enums/day.enum";
import {usersService} from "./user.service";

const db = admin.firestore();

const get = (uid: string): Promise<TaskModel> => {
  return db.collection(CollectionEnum.TASKS)
    .doc(uid)
    .get()
    .then(document => new TaskModel(document));
}

const list = async (groupUid: string): Promise<Array<TaskModel>> => {
  return db.collection(CollectionEnum.TASKS)
    .where('group', '==', groupUid)
    .get()
    .then(querySnapshot => querySnapshot.docs.map(doc => new TaskModel(doc)))
};

const listByDate = async (groupUid: string, day: DayEnum): Promise<Array<any>> => {
  return db.collection(CollectionEnum.TASKS)
    .where('group', '==', groupUid)
    .where('days', 'array-contains', day)
    .get()
    .then(async querySnapshot => {
      const tasks = [];

      for (const doc of querySnapshot.docs) {
        // TODO: For each task calculate which user is responsible for that task for this `date`
        const user = await usersService.getByUid(doc.data().users[0] as string);
        tasks.push(new DateTaskModel(doc, user));
      }

      return tasks;
    });
};

export const taskService = {
  get,
  list,
  listByDate
};
