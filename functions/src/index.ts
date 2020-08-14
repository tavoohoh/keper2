import {methodEnum} from './enums/method.enum';
import {groupFunctions} from './functions/group.function';
import * as functions from 'firebase-functions';

const cors = require('cors')({
  origin: true,
  allowedHeaders: [
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Content-Type',
    'Origin',
    'X-Requested-With',
    'Accept'
  ],
  methods: [methodEnum.OPTIONS, methodEnum.GET, methodEnum.POST, methodEnum.PUT, methodEnum.DELETE]
});

export const health = functions.https.onRequest((request, response) => {
  functions.logger.info(`Health says: Just fine`, {structuredData: true});

  return cors(request, response, async () => {
    response.status(200).send({ health: `Just fine` });
  })
});

export const group = functions.https.onRequest(async (request, response) => {
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
        // get group by id
        resp = groupFunctions.get(authUser, request.query.id.toString());
      } else {
        // get a list of groups
        resp = groupFunctions.list(authUser);
      }

      break;

    case methodEnum.POST:
      // create a group
      resp = groupFunctions.create(authUser, request.body);

      break;

    case methodEnum.PUT:
      // update a group
      if (request.query.id) {
        resp = groupFunctions.update(authUser, request.query.id.toString(), request.body);
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
      // delete a group
      if (request.query.id) {
        resp = groupFunctions.delete(authUser, request.query.id.toString());
      } else {
        resp = {
          status: 400,
          body: {
            error: 'Bad request',
            message: '`id` is a query param required'
          }
        };

        functions.logger.error(`Bad request. Can not delete without group id.`, {structuredData: true});
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


