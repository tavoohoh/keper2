import * as functions from 'firebase-functions';
import {methodEnum} from '../enums/method.enum';
import {userFunctions} from '../functions/user.function';
import {cors} from '../commons/cors';
import {authorization} from '../commons/auth';

const getAuthUser = async (request: functions.https.Request, response: functions.Response<any>) => {
  const { user } = await authorization(request, response);
  return user;
}

export const users = functions.https.onRequest(async (request, response) => {
  return cors(request, response, async () => {
    functions.logger.info(`Users says: Hello!`, {structuredData: true});

    let responseValue: { status: number; body: {} };

    switch (request.method) {
      case methodEnum.GET:
        // get user by logged user or uid or email
        responseValue = await userFunctions.get(await getAuthUser(request, response), request.query);
        break;

      case methodEnum.POST:
        // create a user
        responseValue = await userFunctions.create(request.body);
        break;

      case methodEnum.PUT:
        // update a user
        responseValue = await userFunctions.update(await getAuthUser(request, response), request.body);
        break;

      case methodEnum.DELETE:
        // delete a group
        responseValue = await userFunctions.delete(await getAuthUser(request, response));
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
