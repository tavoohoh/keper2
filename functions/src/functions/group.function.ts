import * as admin from 'firebase-admin';

import {GroupModel} from '../models/group.model';
import {UserAuthModel} from '../models/user.model';
import {CollectionEnum} from '../enums/colletion.enum';
import {groupService} from '../services/group.service';

const db = admin.firestore();

// About queries https://firebase.google.com/docs/firestore/query-data/queries

const get = async (user: UserAuthModel, uid: string) => {
  // TODO: Validate that the user is owner or part of the group to get it

  try {
    const group = await groupService.get(uid);

    // if (user.uid === group.ownerId || group.users.some(el => el === user.uid)) {
      if (group && group.name) {
        return {
          status: 200,
          body: group
        };
      } else {
        return {
          status: 404,
          body: {
            message: 'group not found'
          }
        };
      }
    // } else {
    //   return {
    //     status: 403,
    //     body: {
    //       message: 'Unauthorized'
    //     }
    //   };
    // }

  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to fetch group from database',
        detail: error
      }
    };
  }
};

const list = async (user: UserAuthModel) => {
  // TODO: Query the groups that the user is owner or part of it

  try {
    const groupsService = async () => {
      return db.collection(CollectionEnum.GROUPS)
        .where('ownerId', '==', user.uid)
        .get()
        .then(querySnapshot => querySnapshot.docs.map(doc => {
          return {
            ...doc.data(),
            uid: doc.id,
          }
        }))
    };

    const groups = await groupsService();

    return {
      status: 200,
      body: groups
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to fetch groups from database',
        detail: error
      }
    };
  }
}

const create = async (user: UserAuthModel, group: GroupModel) => {
  try {
    group.ownerId = user.uid;

    await db.collection(CollectionEnum.GROUPS).add(group);

    return {
      status: 201,
      body: {
        message: 'Group was successfully added'
      }
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to add group to database',
        detail: error
      }
    };
  }
}

const update = async (user: UserAuthModel, uid: string, group: GroupModel) => {
  // TODO: Validate that the user is the owner of the group to updated it

  try {
    await db.collection(CollectionEnum.GROUPS).doc(uid).update(group);

    return {
      status: 200,
      body: {
        message: 'Group was successfully updated'
      }
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to update group from database',
        detail: error
      }
    };
  }
}

const deleteGroup = async (user: UserAuthModel, uid: string) => {
  // TODO: Validate that the user is the owner of the group to delete it

  try {
    await db.collection(CollectionEnum.GROUPS).doc(uid).delete();

    return {
      status: 200,
      body: {
        message: 'Group was successfully deleted'
      }
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to delete group from database',
        detail: error
      }
    };
  }
}

export const groupFunctions = {
  get,
  list,
  create,
  update,
  delete: deleteGroup
};
