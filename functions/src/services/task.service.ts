import * as admin from 'firebase-admin';
import {CollectionEnum} from '../enums/colletion.enum';
import {TaskModel} from '../models/task.model';

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

export const taskService = {
  get,
  list
};
