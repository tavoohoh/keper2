import {TaskModel} from '../models/task.model';

const getTask = (authUser: any, id: string) => {
  return {
    status: 200,
    body: {
      message: 'Get task by id is not yet implemented'
    }
  };
};

const listTask = (authUser: any, groupId: string) => {
  return {
    status: 200,
    body: {
      message: 'Get task list is not yet implemented'
    }
  };
}

const listTaskByDate = (authUser: any, groupId: string, date: string) => {
  return {
    status: 200,
    body: {
      message: 'Get task list by date is not yet implemented'
    }
  };
}

const createTask = (authUser: any, task: TaskModel) => {
  return {
    status: 200,
    body: {
      message: 'Create task is not yet implemented'
    }
  };
}

const updateTask = (authUser: any, id: string, task: TaskModel) => {
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
  get: getTask,
  list: listTask,
  listByDate: listTaskByDate,
  create: createTask,
  update: updateTask,
  delete: deleteTask
};
