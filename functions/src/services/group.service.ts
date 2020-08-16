import * as admin from 'firebase-admin';
import {CollectionEnum} from '../enums/colletion.enum';
const db = admin.firestore();

const get = (uid: string) => {
  return db.collection(CollectionEnum.GROUPS)
    .doc(uid)
    .get()
    .then(document => {
      return {
        uid: document.id,
        ...document.data()
      }
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
