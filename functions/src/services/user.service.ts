import * as admin from 'firebase-admin';
import {CollectionEnum} from '../enums/colletion.enum';
import {QuerySetModel} from '../models/query-set.model';

const db = admin.firestore();

const get = (querySet: QuerySetModel) => {
  return db.collection(CollectionEnum.USERS)
    .where(querySet.fieldPath, querySet.opStr, querySet.value)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.docs[0]) {
        const user = querySnapshot.docs[0];
        return {
          ...user.data(),
          uid: user.id
        };
      } else {
        return null;
      }
    });
}

export const usersService = {
  get
}
