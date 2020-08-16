import * as admin from 'firebase-admin';

import {GroupModel} from '../models/group.model';
import {UserAuthModel} from '../models/user.model';
import {CollectionEnum} from '../enums/colletion.enum';
import {DbDocumentModel} from '../models/db-document.model';

const db = admin.firestore();

// About queries https://firebase.google.com/docs/firestore/query-data/queries

const getGroup = async (user: UserAuthModel, uid: string) => {
  // TODO: Validate that the user is owner or part of the group to get it

  try {
    const groupService = () => {
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

    const group = new GroupModel(await groupService() as DbDocumentModel);

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

const listGroup = async (user: UserAuthModel) => {
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

const createGroup = async (user: UserAuthModel, group: GroupModel) => {
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

const updateGroup = async (user: UserAuthModel, uid: string, group: GroupModel) => {
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
  get: getGroup,
  list: listGroup,
  create: createGroup,
  update: updateGroup,
  delete: deleteGroup
};
