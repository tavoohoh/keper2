import * as functions from 'firebase-functions';
import {methodEnum} from '../enums/method.enum';
import {taskFunctions} from '../functions/task.function';
import {cors} from '../commons/cors';
import {authorization} from '../commons/auth'

export const tasks = functions.https.onRequest(async (request, response) => {
  return cors(request, response, async () => {
    functions.logger.info(`Group says: Hello!`, {structuredData: true});

    const { user } = await authorization(request, response);
    let responseValue: { status: number; body: {} };

    switch (request.method) {
      case methodEnum.GET:
        if (request.query && request.query.id) {
          // get task by id
          responseValue = await taskFunctions.get(user, request.query.id.toString());
        } else if (request.query && request.query.groupId) {
          if (request.query.date) {
            // get a list of tasks by date
            responseValue = await taskFunctions.listByDate(user, request.query.groupId.toString(), request.query.date.toString());
          } else {
            // get a list of tasks
            responseValue = await taskFunctions.list(user, request.query.groupId.toString());
          }
        } else {
          responseValue = {
            status: 400,
            body: {
              error: 'Bad request',
              message: 'Make sure to include `id` or `groupId` and/or `date` as a query param.'
            }
          };

          functions.logger.error(`Bad req. Make sure to include \`id\` or \`groupId\` and/or \`date\` as a query param.`, {structuredData: true});
        }

        break;

      case methodEnum.POST:
        // create a task
        responseValue = await taskFunctions.create(user, request.body);

        break;

      case methodEnum.PUT:
        // update a task
        if (request.query.id) {
          responseValue = await taskFunctions.update(user, request.query.id.toString(), request.body);
        } else {
          responseValue = {
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
          responseValue = await taskFunctions.delete(user, request.query.id.toString());
        } else {
          responseValue = {
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
        responseValue = {
          status: 405,
          body: {
            error: 'Method not allowed'
          }
        };

        functions.logger.error(`Method not allowed.`, {structuredData: true});
        break;
    }

    response.status(responseValue.status).send(responseValue.body);
  })
});
