import * as admin from 'firebase-admin';
import {CollectionEnum} from '../enums/colletion.enum';
import {DateTaskModel, TaskModel} from '../models/task.model';
import {DayEnum} from "../enums/day.enum";
import {usersService} from "./user.service";
import {taskUtil} from "../commons/task.utils";

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

const listByDate = async (groupUid: string, day: DayEnum, date: string): Promise<Array<any>> => {
  return db.collection(CollectionEnum.TASKS)
    .where('group', '==', groupUid)
    .where('days', 'array-contains', day)
    .get()
    .then(async querySnapshot => {
      const tasks = [];
      let taskUserIndexMod = 0;

      for (const doc of querySnapshot.docs) {
        const taskUserId = taskUtil.calculateTaskUserIndex({
          usersArray: doc.data().users,
          date,
          taskDays: doc.data().days
        }, taskUserIndexMod);

        const user = await usersService.getByUid(<string>taskUserId);
        tasks.push(new DateTaskModel(doc, user));
        taskUserIndexMod = taskUserIndexMod + 1 < doc.data().users.length ? taskUserIndexMod + 1 : 0;
      }

      return tasks;
    });
};

export const taskService = {
  get,
  list,
  listByDate
};
