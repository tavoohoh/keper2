import * as functions from 'firebase-functions';
import {methodEnum} from '../enums/method.enum';
import {groupFunctions} from '../functions/group.function';
import {cors} from '../commons/cors';
import {authorization} from '../commons/auth';

export const groups = functions.https.onRequest(async (request, response) => {
  return cors(request, response, async () => {
    functions.logger.info(`Group says: Hello!`, {structuredData: true});

    const { user } = await authorization(request, response);
    let responseValue: { status: number; body: {} };

    switch (request.method) {
      case methodEnum.GET:
        if (request.query && request.query.id) {
          // get group by id
          responseValue = groupFunctions.get(user, request.query.id.toString());
        } else {
          // get a list of groups
          responseValue = groupFunctions.list(user);
        }

        break;

      case methodEnum.POST:
        // create a group
        responseValue = groupFunctions.create(user, request.body);

        break;

      case methodEnum.PUT:
        // update a group
        if (request.query.id) {
          responseValue = groupFunctions.update(user, request.query.id.toString(), request.body);
        } else {
          responseValue = {
            status: 400,
            body: {
              error: 'Bad requestuest',
              message: '`id` is a query param requestuired'
            }
          };

          functions.logger.error(`Bad requestuest. Can not update without group id.`, {structuredData: true});
        }

        break;

      case methodEnum.DELETE:
        // delete a group
        if (request.query.id) {
          responseValue = groupFunctions.delete(user, request.query.id.toString());
        } else {
          responseValue = {
            status: 400,
            body: {
              error: 'Bad requestuest',
              message: '`id` is a query param requestuired'
            }
          };

          functions.logger.error(`Bad requestuest. Can not delete without group id.`, {structuredData: true});
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
