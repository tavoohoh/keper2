import * as admin from 'firebase-admin';

// import {DateTasksModel, TaskModel, DateTaskModel} from '../models/task.model';
import {TaskModel} from '../models/task.model';
import {UserAuthModel} from '../models/user.model';
import {CollectionEnum} from '../enums/colletion.enum';
import {permissionValidator} from '../commons/permission-validator';
import {groupService} from '../services/group.service';
import {taskService} from '../services/task.service';
import {WeekDaysArray} from '../constants/days-date.constant';

const db = admin.firestore();

const get = async (authUser: any, taskUid: string) => {
  try {
    const task = await taskService.get(taskUid);

    // check if user has permissions over this task's group
    if (!await permissionValidator.canReadGroup(authUser.uid, task.group)) {
      return {
        status: 403,
        body: {
          error: 'Unauthorized',
          message: 'You are not member of this task\'s group',
        }
      };
    }

    return {
      status: 201,
      body: task
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to fetch this task from database',
        detail: error
      }
    };
  }
};

const list = async (authUser: any, groupId: string) => {
  try {
    // check if user has permissions over this group
    if (!await permissionValidator.canReadGroup(authUser.uid, groupId)) {
      return {
        status: 403,
        body: {
          error: 'Unauthorized',
          message: 'You are not member of this group',
        }
      };
    }

    // Query tasks by group id
    const tasks = await taskService.list(groupId);

    return {
      status: 200,
      body: tasks
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to fetch tasks from database',
        detail: error
      }
    };
  }
}

// TODO: list tasks by date
// This means that every task should have the following structure:
// [ { name: string; user: <assigned user of this task>; schedule: Array<string>; group: string; } ]
// @<assigned user of this task> The user that is responsible for the task for the selected date
// The selected day weekday must match be included in the `days` array in order to by fetched
const listByDate = async (authUser: any, groupId: string, date: string) => {
  const tasksDate = new Date(date);
  const tasks = await taskService.listByDate(groupId, WeekDaysArray[tasksDate.getDay()], date);
  const dateTasks = {
    date: {
      fullDate: tasksDate.toLocaleDateString(),
      monthDay: tasksDate.getDate(),
      weekday: WeekDaysArray[tasksDate.getDay()]
    },
    tasks
  };

  return {
    status: 200,
    body: {
      message: dateTasks
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

const update = async (authUser: any, taskUid: string, task: TaskModel) => {
  try {
    const { group: kpTaskGroup } = await taskService.get(taskUid);

    // check if user has permissions over this group
    if (!await permissionValidator.canReadGroup(authUser.uid, kpTaskGroup)) {
      return {
        status: 403,
        body: {
          error: 'Unauthorized',
          message: 'You are not member of this group',
        }
      };
    }

    // Update task
    await db.collection(CollectionEnum.TASKS).doc(taskUid).update(task);

    return {
      status: 200,
      body: {
        message: 'Task was successfully updated'
      }
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to update task from database',
        detail: error
      }
    };
  }
}

const deleteTask = async (authUser: any, taskUid: string) => {
  try {
    const { group: kpTaskGroup } = await taskService.get(taskUid);

    // check if user has permissions over this group
    if (!await permissionValidator.canReadGroup(authUser.uid, kpTaskGroup)) {
      return {
        status: 403,
        body: {
          error: 'Unauthorized',
          message: 'You are not member of this group',
        }
      };
    }

    // get group and remove task from it before deleting te task
    let { tasks: kpGroupTasks } = await groupService.get(kpTaskGroup);

    if (kpGroupTasks?.includes(taskUid)) {
      kpGroupTasks = kpGroupTasks.filter(e => e !== taskUid);

      await db.collection(CollectionEnum.GROUPS).doc(<string>kpTaskGroup).update({ tasks: kpGroupTasks });
    }

    // Delete task
    await db.collection(CollectionEnum.TASKS).doc(taskUid).delete();

    return {
      status: 200,
      body: {
        message: 'Task was successfully deleted'
      }
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        message: 'Unable to delete task from database',
        detail: error
      }
    };
  }
}

export const taskFunctions = {
  get,
  list,
  listByDate,
  create,
  update,
  delete: deleteTask
};
