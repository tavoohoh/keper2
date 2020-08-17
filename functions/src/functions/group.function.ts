import * as admin from 'firebase-admin';

import {FullGroupModel, GroupModel} from '../models/group.model';
import {UserAuthModel} from '../models/user.model';
import {CollectionEnum} from '../enums/colletion.enum';
import {groupService} from '../services/group.service';
import {usersService} from '../services/user.service';
import {permissionValidator} from '../commons/permission-validator';

const db = admin.firestore();

// About queries https://firebase.google.com/docs/firestore/query-data/queries

const get = async (user: UserAuthModel, groupUid: string) => {
  try {
    if (await permissionValidator.canReadGroup(user.uid, groupUid)) {
      const group = await groupService.get(groupUid);
      return {
        status: 200,
        body: group
      };
    } else {
      return {
        status: 403,
        body: {
          error: 'Unauthorized',
          message: 'You are not member of this group',
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

const list = async (user: UserAuthModel) => {
  const { uid: userUid } = await usersService.get({
    fieldPath: 'fk',
    opStr: '==',
    value: user.uid
  });

  try {
    const groups = await groupService.list(<string>userUid);

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
    const kpGroup: FullGroupModel = {
      ...group,
      users: [],
      tasks: []
    };

    const kpUser = await usersService.get({
      fieldPath: 'fk',
      opStr: '==',
      value: user.uid
    });

    if (kpUser.uid) {
      const kpUserId = kpUser.uid;

      kpGroup.ownerId = kpUserId;
      kpGroup.users.push(kpUserId);
      const newGroup = await db.collection(CollectionEnum.GROUPS).add(kpGroup);

      kpUser.groups = [
        newGroup.id,
        ...kpUser.groups || []
      ];

      await db.collection(CollectionEnum.USERS).doc(kpUserId).update(kpUser);

      return {
        status: 201,
        body: {
          message: 'Group was successfully added',
          groupUid: newGroup.id
        }
      };
    }

    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to add this user as member to this new group. This may be a server error',
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

const update = async (authUser: UserAuthModel, groupUid: string, group: GroupModel) => {
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

    await db.collection(CollectionEnum.GROUPS).doc(groupUid).update(group);

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

const deleteGroup = async (user: UserAuthModel, groupUid: string) => {
  try {
    if (!await permissionValidator.canWriteGroup(user.uid, groupUid)) {
      return {
        status: 403,
        body: {
          error: 'Unauthorized',
          message: 'You have have to be the owner of this group',
        }
      };
    }

    const group = await groupService.get(groupUid);

    // remove group from users before deleting the group
    if (group.users) {
      for (const userId of group.users) {
        const {groups: userGroups, uid: userUid} = await usersService.getByUid(userId);

        if (userGroups?.includes(groupUid)) {
          const updatedUser = {
            groups: userGroups.filter(e => e !== groupUid)
          };

          await db.collection(CollectionEnum.USERS).doc(<string>userUid).update(updatedUser);
        }
      }
    }

    await db.collection(CollectionEnum.GROUPS).doc(groupUid).delete();

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
