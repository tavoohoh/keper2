import * as admin from 'firebase-admin';
import {CollectionEnum} from '../enums/colletion.enum';
import {QuerySetModel} from '../models/query-set.model';
import {KpUserModel, UserModel} from "../models/user.model";

const db = admin.firestore();

const get = (querySet: QuerySetModel): Promise<KpUserModel> => {
  return db.collection(CollectionEnum.USERS)
    .where(querySet.fieldPath, querySet.opStr, querySet.value)
    .get()
    .then(querySnapshot => {
      const document = querySnapshot.docs[0];
      const user: KpUserModel = {
        uid: document.id,
        fk: document.data().fk,
        email: document.data().email,
        displayName: document.data().displayName,
        groups: document.data().groups,
        tasks: document.data().tasks
      };

      return user;
    });
};

const getByUid = (uid: string): Promise<KpUserModel> => {
  return db.collection(CollectionEnum.USERS)
    .doc(uid)
    .get()
    .then(user => {
      const kpUser: KpUserModel = {
        uid: user.id,
        fk: user.data()?.fk,
        email: user.data()?.email,
        displayName: user.data()?.displayName,
        groups: user.data()?.groups,
        tasks: user.data()?.tasks
      };

      return kpUser;
    });
};

const list = (querySet: QuerySetModel): Promise<Array<KpUserModel>> => {
  return db.collection(CollectionEnum.USERS)
    .where(querySet.fieldPath, querySet.opStr, querySet.value)
    .get()
    .then(querySnapshot => {
      return querySnapshot.docs.map(document => {
        const user: KpUserModel = {
          fk: document.id,
          email: document.data().email,
          displayName: document.data().displayName
        };

        return user;
      });
    });
};

const update = async (userId: string, user: UserModel): Promise<any> => {
  if (user.password) {
    return {
      status: 404,
      body: {
        message: 'Do not include password property in the body'
      }
    };
  }

  const fbUser = await admin.auth().updateUser(userId, user);

  const kpUserValue: KpUserModel = {
    fk: fbUser.uid,
    email: fbUser.email || '',
    displayName: fbUser.displayName || ''
  };

  const kpUser: any = await usersService.get({
    fieldPath: 'fk',
    opStr: '==',
    value: userId
  });

  return await db.collection(CollectionEnum.USERS).doc(kpUser.uid).update(kpUserValue);
};

export const usersService = {
  get,
  getByUid,
  list,
  update
}
