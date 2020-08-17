import * as admin from 'firebase-admin';
import {CollectionEnum} from '../enums/colletion.enum';
import {FullGroupModel} from "../models/group.model";
const db = admin.firestore();

const get = (uid: string): Promise<FullGroupModel> => {
  return db.collection(CollectionEnum.GROUPS)
    .doc(uid)
    .get()
    .then(document => {
      return new FullGroupModel(document);
    })
}

export const groupService = {
  get
}
