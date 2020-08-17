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
    });
}
//
// const list = async (userId) => {
//   // get user groups
//   return db.collection(CollectionEnum.GROUPS)
//     .where('ownerId', '==', user.uid)
//     .get()
//     .then(querySnapshot => querySnapshot.docs.map(doc => {
//       return {
//         ...doc.data(),
//         uid: doc.id,
//       }
//     }))
// };

export const groupService = {
  get
}
