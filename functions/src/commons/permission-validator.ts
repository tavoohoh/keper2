import {usersService} from '../services/user.service';
import * as functions from 'firebase-functions';
import {groupService} from "../services/group.service";

const canReadGroup = async (userUid: string, groupUid: string, isFirebaseUser = true): Promise<boolean> => {
  const user = isFirebaseUser ? await usersService.get({
    fieldPath: 'fk',
    opStr: '==',
    value: userUid
  }) : await usersService.getByUid(userUid);

  functions.logger.info(`Checking "canWriteGroup" permissions for user ${user.uid} over group ${groupUid}`);

  return !!user.groups?.includes(groupUid);
}

const canWriteGroup = async (userUid: string, groupUid: string, isFirebaseUser = true): Promise<boolean> => {
  const user = isFirebaseUser ? await usersService.get({
    fieldPath: 'fk',
    opStr: '==',
    value: userUid
  }) : await usersService.getByUid(userUid);

  const group = await groupService.get(groupUid);

  functions.logger.info(`Checking "canWriteGroup" permissions for user ${user.uid} over group ${group.uid}`);

  return group.ownerId === user.uid;
}

export const permissionValidator = {
  canReadGroup,
  canWriteGroup
}
