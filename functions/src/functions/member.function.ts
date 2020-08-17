import * as admin from 'firebase-admin';

import {UserAuthModel} from '../models/user.model';
import {CollectionEnum} from '../enums/colletion.enum';
import {groupService} from '../services/group.service';
import {usersService} from '../services/user.service';
import {permissionValidator} from '../commons/permission-validator';

const db = admin.firestore();

// About queries https://firebase.google.com/docs/firestore/query-data/queries

const list = async (authUser: UserAuthModel, groupUid: string) => {
  try {
    if (!await permissionValidator.canReadGroup(authUser.uid, groupUid)) {
      return {
        status: 403,
        body: {
          error: 'Unauthorized',
          message: 'You have to are not a member of this group',
        }
      };
    }

    const groupMembers = await usersService.list({
      fieldPath: 'groups',
      opStr: 'array-contains',
      value: groupUid
    });

    return {
      status: 200,
      body: groupMembers
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to fetch group members from database',
        detail: error
      }
    };
  }
}

const add = async (authUser: UserAuthModel, groupUid: string, userUid: string) => {
  try {
    if (!await permissionValidator.canReadGroup(authUser.uid, groupUid)) {
      return {
        status: 403,
        body: {
          error: 'Unauthorized',
          message: 'You are not member of this group',
        }
      };
    }

    const group = await groupService.get(groupUid);
    const user = await usersService.getByUid(userUid);

    if (group.users?.includes(<string>user.uid) && user.groups?.includes(groupUid)) {
      return {
        status: 400,
        body: {
          error: 'Bad request',
          message: 'User is already member of this group'
        }
      }
    }

    if (!user.groups?.includes(groupUid)) {
      const kpUser = {
        groups: user.groups
      };

      kpUser.groups?.push(groupUid);

      await db.collection(CollectionEnum.USERS).doc(<string>user.uid).update(kpUser);
    }

    if (!group.users.includes(<string>user.uid)) {
      const groupValue = {
        users: group.users
      };

      groupValue.users.push(<string>user.uid);

      await db.collection(CollectionEnum.GROUPS).doc(groupUid).update(groupValue);
    }

    return {
      status: 200,
      body: {
        message: 'User was successfully added as member to this group'
      }
    }
  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to add user to this group',
        detail: error
      }
    };
  }
}

const remove = async (authUser: UserAuthModel, groupUid: string, userUid: string) => {
  try {
    if (!await permissionValidator.canWriteGroup(authUser.uid, groupUid)) {
      return {
        status: 403,
        body: {
          error: 'Unauthorized',
          message: 'You have have to be the owner of this group',
        }
      };
    }

    const group = await groupService.get(groupUid);

    if (group.ownerId === userUid) {
      return {
        status: 400,
        body: {
          error: 'Bad request',
          message: 'You hare the owner of this group, can not remove your self',
        }
      };
    }

    const user = await usersService.getByUid(userUid);

    if (!group.users?.includes(<string>user.uid) && !user.groups?.includes(groupUid)) {
      return {
        status: 400,
        body: {
          error: 'Bad request',
          message: 'User is not member of this group'
        }
      }
    }

    if (user.groups?.includes(groupUid)) {
      const kpUser = {
        groups: user.groups.filter(e => e !== groupUid)
      };

      await db.collection(CollectionEnum.USERS).doc(<string>user.uid).update(kpUser);
    }

    if (group.users?.includes(<string>user.uid)) {
      const groupValue = {
        users: group.users.filter(e => e !== user.uid)
      };

      await db.collection(CollectionEnum.GROUPS).doc(groupUid).update(groupValue);
    }

    return {
      status: 200,
      body: {
        message: 'User was successfully removed from this group'
      }
    }
  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to remove user from this group',
        detail: error
      }
    };
  }
}

export const memberFunctions = {
  list,
  add,
  remove
};
