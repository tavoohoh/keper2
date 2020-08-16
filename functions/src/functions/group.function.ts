import {GroupModel} from '../models/group.model';
import {UserAuthModel} from '../models/user.model';

const getGroup = (authUser: any, id: string) => {
  return {
    status: 200,
    body: {
      message: 'Get group by id is not yet implemented'
    }
  };
};

const listGroup = (authUser: any) => {
  return {
    status: 200,
    body: {
      message: 'Get group list is not yet implemented'
    }
  };
}

const createGroup = (user: UserAuthModel, group: GroupModel) => {
  return {
    status: 200,
    body: {
      message: 'Create group is not yet implemented',
      user
    }
  };
}

const updateGroup = (authUser: any, id: string, group: GroupModel) => {
  return {
    status: 200,
    body: {
      message: 'Update group is not yet implemented'
    }
  };
}

const deleteGroup = (authUser: any, id: string) => {
  return {
    status: 200,
    body: {
      message: 'Delete group is not yet implemented'
    }
  };
}

export const groupFunctions = {
  get: getGroup,
  list: listGroup,
  create: createGroup,
  update: updateGroup,
  delete: deleteGroup
};
