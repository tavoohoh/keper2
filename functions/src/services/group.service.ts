import * as admin from 'firebase-admin';
import {CollectionEnum} from '../enums/colletion.enum';
import {FullGroupModel} from "../models/group.model";
const db = admin.firestore();

const get = (uid: string): Promise<FullGroupModel> => {
  return db.collection(CollectionEnum.GROUPS)
    .doc(uid)
    .get()
    .then(document => new FullGroupModel(document));
}

const list = async (userUid: string): Promise<Array<FullGroupModel>> => {
  return db.collection(CollectionEnum.GROUPS)
    .where('users', 'array-contains', userUid)
    .get()
    .then(querySnapshot => querySnapshot.docs.map(doc => new FullGroupModel(doc)));
};

export const groupService = {
  get,
  list
}
