import * as functions from 'firebase-functions';
import {methodEnum} from '../enums/method.enum';
import {cors} from '../commons/cors';
import {authorization} from '../commons/auth';
import {memberFunctions} from '../functions/member.function';

export const members = functions.https.onRequest(async (request, response) => {
  return cors(request, response, async () => {
    functions.logger.info(`Members says: Hello!`);

    const { user } = await authorization(request, response);
    let responseValue: { status: number; body: {} };

    switch (request.method) {
      case methodEnum.GET:
        // Get group members
        if (request.body && request.query.groupId) {
          responseValue = await memberFunctions.list(user, request.query.groupId.toString());
        } else {
          responseValue = {
            status: 400,
            body: {
              error: 'Bad request',
              message: '`groupId` are a required query param'
            }
          };

          functions.logger.error(`\`groupId\` are a required query param`);
        }
        break;

      case methodEnum.PUT:
        // Add a member to a group
        if (request.body && request.body.groupId && request.body.userId) {
          responseValue = await memberFunctions.add(user, request.body.groupId, request.body.userId);
        } else {
          responseValue = {
            status: 400,
            body: {
              error: 'Bad request',
              message: '`groupId` and `userId` are required'
            }
          };

          functions.logger.error(`Bad request. \`groupId\` and \`userId\` are required`);
        }

        break;

      case methodEnum.POST:
        // remove member from group
        if (request.body && request.body.groupId && request.body.userId) {
          responseValue = await memberFunctions.remove(user, request.body.groupId, request.body.userId);
        } else {
          responseValue = {
            status: 400,
            body: {
              error: 'Bad request',
              message: '`groupId` and `userId` are required'
            }
          };

          functions.logger.error(`\`groupId\` and \`userId\` are required`);
        }

        break;

      default:
        responseValue = {
          status: 405,
          body: {
            error: 'Method not allowed'
          }
        };
        functions.logger.error(`Method not allowed.`);

        break;
    }

    response.status(responseValue.status).send(responseValue.body);
  })
});
