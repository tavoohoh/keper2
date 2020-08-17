import * as admin from 'firebase-admin';

import {UserAuthModel} from '../models/user.model';
import {CollectionEnum} from '../enums/colletion.enum';
import {groupService} from '../services/group.service';
import {usersService} from '../services/user.service';

const db = admin.firestore();

// About queries https://firebase.google.com/docs/firestore/query-data/queries

const list = async (user: UserAuthModel, groupUid: string) => {
  // TODO: Validate that user is part of group
  try {
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

const add = async (groupUid: string, userUid: string) => {
  // TODO: Validate that user is part of group
  try {
    const group = await groupService.get(groupUid);

    if (!group.uid) {
      return {
        status: 404,
        body: {
          error: 'Not found',
          message: 'Group not found'
        }
      }
    }

    const user = await usersService.get({
      fieldPath: 'fk',
      opStr: '==',
      value: userUid
    });

    if (!user.uid) {
      return {
        status: 404,
        body: {
          error: 'Not found',
          message: 'User not found'
        }
      }
    }

    if ((group.users && group.users.includes(user.uid)) && (user.groups && user.groups.includes(groupUid))) {
      return {
        status: 400,
        body: {
          error: 'Bad request',
          message: 'User is already member of this group'
        }
      }
    }

    if (user.groups && !user.groups.includes(groupUid)) {
      const kpUser = {
        groups: user.groups
      };

      kpUser.groups.push(groupUid);

      await db.collection(CollectionEnum.USERS).doc(user.uid).update(kpUser);
    }

    if (!group.users.includes(user.uid)) {
      const groupValue = {
        users: group.users
      };

      groupValue.users.push(user.uid);

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

const remove = async (groupUid: string, userUid: string) => {
  // TODO: Validate that user is part of group
  try {
    const group = await groupService.get(groupUid);

    if (!group.uid) {
      return {
        status: 404,
        body: {
          error: 'Not found',
          message: 'Group not found'
        }
      }
    }

    const user = await usersService.get({
      fieldPath: 'fk',
      opStr: '==',
      value: userUid
    });

    if (!user.uid) {
      return {
        status: 404,
        body: {
          error: 'Not found',
          message: 'User not found'
        }
      }
    }

    if ((group.users && !group.users.includes(user.uid)) && (user.groups && !user.groups.includes(groupUid))) {
      return {
        status: 400,
        body: {
          error: 'Bad request',
          message: 'User is not member of this group'
        }
      }
    }

    if (user.groups && user.groups.includes(groupUid)) {
      const kpUser = {
        groups: user.groups.filter(e => e !== groupUid)
      };

      await db.collection(CollectionEnum.USERS).doc(user.uid).update(kpUser);
    }

    if (group.users.includes(user.uid)) {
      const groupValue = {
        users: group.users.filter(e => e !== user.uid)
      };

      await db.collection(CollectionEnum.GROUPS).doc(groupUid).update(groupValue);
    }

    console.log('removed');

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
