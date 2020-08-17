import {TaskModel} from '../models/task.model';
import {UserAuthModel} from '../models/user.model';
import {permissionValidator} from '../commons/permission-validator';
import {CollectionEnum} from '../enums/colletion.enum';
import * as admin from 'firebase-admin';
import {groupService} from "../services/group.service";

const db = admin.firestore();

const get = (authUser: any, id: string) => {
  return {
    status: 200,
    body: {
      message: 'Get task by id is not yet implemented'
    }
  };
};

const list = (authUser: any, groupId: string) => {
  return {
    status: 200,
    body: {
      message: 'Get task list is not yet implemented'
    }
  };
}

const listByDate = (authUser: any, groupId: string, date: string) => {
  return {
    status: 200,
    body: {
      message: 'Get task list by date is not yet implemented'
    }
  };
}

const create = async (authUser: UserAuthModel, task: TaskModel) => {
  try {
    // check if user has permissions over this group
    if (!await permissionValidator.canReadGroup(authUser.uid, task.group)) {
      return {
        status: 403,
        body: {
          error: 'Unauthorized',
          message: 'You are not member of this group',
        }
      };
    }

    // create this task
    const { id: taskId } = await db.collection(CollectionEnum.TASKS).add(task);

    // update group array of task with the ID of this new task
    let { tasks: groupTasks } = await groupService.get(task.group);

    groupTasks = [
      taskId,
      ...groupTasks || []
    ];

    await db.collection(CollectionEnum.GROUPS).doc(task.group).update({ tasks: groupTasks });

    return {
      status: 201,
      body: {
        message: 'Task was successfully added',
        task: taskId
      }
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to add task to database',
        detail: error
      }
    };
  }
}

const update = (authUser: any, id: string, task: TaskModel) => {
  return {
    status: 200,
    body: {
      message: 'Update task is not yet implemented'
    }
  };
}

const deleteTask = (authUser: any, id: string) => {
  return {
    status: 200,
    body: {
      message: 'Delete task is not yet implemented'
    }
  };
}

export const taskFunctions = {
  get,
  list,
  listByDate,
  create,
  update,
  delete: deleteTask
};
