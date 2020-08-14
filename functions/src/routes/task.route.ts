import * as functions from 'firebase-functions';
import {methodEnum} from '../enums/method.enum';
import {taskFunctions} from '../functions/task.function';
import {cors} from '../commons/cors';

export const tasks = functions.https.onRequest(async (request, response) => {
  functions.logger.info(`Group says: Hello!`, {structuredData: true});

  let resp: { status: number; body: {} } = {
    status: 200,
    body: { message: 'Ok' }
  };

  const authUser = null;

  // TODO: check authentication

  switch (request.method) {
    case methodEnum.GET:
      if (request.query && request.query.id) {
        // get task by id
        resp = taskFunctions.get(authUser, request.query.id.toString());
      } else if (request.query && request.query.groupId) {
        if (request.query.date) {
          // get a list of tasks by date
          resp = taskFunctions.listByDate(authUser, request.query.groupId.toString(), request.query.date.toString());
        } else {
          // get a list of tasks
          resp = taskFunctions.list(authUser, request.query.groupId.toString());
        }
      } else {
        resp = {
          status: 400,
          body: {
            error: 'Bad request',
            message: 'Make sure to include `id` or `groupId` and/or `date` as a query param.'
          }
        };

        functions.logger.error(`Bad request. Make sure to include \`id\` or \`groupId\` and/or \`date\` as a query param.`, {structuredData: true});
      }

      break;

    case methodEnum.POST:
      // create a task
      resp = taskFunctions.create(authUser, request.body);

      break;

    case methodEnum.PUT:
      // update a task
      if (request.query.id) {
        resp = taskFunctions.update(authUser, request.query.id.toString(), request.body);
      } else {
        resp = {
          status: 400,
          body: {
            error: 'Bad request',
            message: '`id` is a query param required'
          }
        };

        functions.logger.error(`Bad request. Can not update without group id.`, {structuredData: true});
      }

      break;

    case methodEnum.DELETE:
      // delete a task
      if (request.query.id) {
        resp = taskFunctions.delete(authUser, request.query.id.toString());
      } else {
        resp = {
          status: 400,
          body: {
            error: 'Bad request',
            message: '`id` is a query param required'
          }
        };

        functions.logger.error(`Bad request. Can not delete without task id.`, {structuredData: true});
      }

      break;

    default:
      resp = {
        status: 405,
        body: {
          error: 'Method not allowed'
        }
      };

      functions.logger.error(`Method not allowed.`, {structuredData: true});
      break;
  }

  return cors(request, response, async () => {
    response.status(resp.status).send(resp.body);
  })
});
