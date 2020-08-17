import * as admin from 'firebase-admin';
import {KpUserModel, UserAuthModel, UserModel} from '../models/user.model';
import {CollectionEnum} from '../enums/colletion.enum';
import {QuerySetModel} from '../models/query-set.model';
import {usersService} from '../services/user.service';

const db = admin.firestore();

// About queries https://firebase.google.com/docs/firestore/query-data/queries
// About user management https://firebase.google.com/docs/auth/admin/manage-users

const get = async (user: UserAuthModel, query: { email?: string, uid?: string }) => {
  try {
    const querySet: QuerySetModel = {
      fieldPath: 'fk',
      opStr: '==',
      value: user.uid
    };

    if (query.email) {
      querySet.fieldPath = 'email';
      querySet.value = query.email;
    } else if (query.uid) {
      querySet.value = query.uid;
    }

    const kpUser = await usersService.get(querySet);

    if (kpUser) {
      return {
        status: 200,
        body: kpUser
      };
    } else {
      return {
        status: 404,
        body: {
          error: 'User not found',
          message: 'Unable to found a user with the provided `uid` or `email`'
        }
      }
    }
  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to create user',
        detail: error
      }
    };
  }
};

const create = async (user: UserModel) => {
  try {
    const fbUser = await admin.auth().createUser(user);

    const kpUserValue: KpUserModel = {
      fk: fbUser.uid,
      email: fbUser.email || '',
      displayName: fbUser.displayName || '',
      groups: [],
      tasks: []
    };

    await db.collection(CollectionEnum.USERS).add(kpUserValue);

    return {
      status: 201,
      body: {
        message: 'User was successfully added'
      }
    };

  } catch (error) {
    return {
      status: 500,
      body: {
        message: 'Unable to create user',
        detail: error
      }
    };
  }
};

const update = async (authUser: UserAuthModel, user: UserModel) => {
  try {
    await usersService.update(authUser.uid, user);

    return {
      status: 200,
      body: {
        message: 'User was successfully updated'
      }
    };

  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to create user',
        detail: error
      }
    };
  }
};

const deleteUser = async (user: UserModel) => {
  try {
    await admin.auth().deleteUser(user.uid);

    const kpUser: any = await usersService.get({
      fieldPath: 'fk',
      opStr: '==',
      value: user.uid
    });

    await db.collection(CollectionEnum.USERS).doc(kpUser.uid).delete();

    return {
      status: 200,
      body: {
        message: 'User was successfully deleted'
      }
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to delete user from database',
        detail: error
      }
    };
  }
};

export const userFunctions = {
  get,
  create,
  update,
  delete: deleteUser
}
