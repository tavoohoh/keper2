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
        if (request.query && request.query.uid) {
          // get group by id
          responseValue = await groupFunctions.get(user, request.query.uid.toString());
        } else {
          // get a list of groups
          responseValue = await groupFunctions.list(user);
        }

        break;

      case methodEnum.POST:
        // create a group
        responseValue = await groupFunctions.create(user, request.body);

        break;

      case methodEnum.PUT:
        // update a group
        if (request.query.uid) {
          responseValue = await groupFunctions.update(user, request.query.uid.toString(), request.body);
        } else {
          responseValue = {
            status: 400,
            body: {
              error: 'Bad request',
              message: '`uid` is a required query param'
            }
          };

          functions.logger.error(`Bad request. Can not update without group uid.`, {structuredData: true});
        }

        break;

      case methodEnum.DELETE:
        // delete a group
        if (request.query.uid) {
          responseValue = await groupFunctions.delete(user, request.query.uid.toString());
        } else {
          responseValue = {
            status: 400,
            body: {
              error: 'Bad requestuest',
              message: '`uid` is a required query param'
            }
          };

          functions.logger.error(`Bad request. Can not delete without group uid.`, {structuredData: true});
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
