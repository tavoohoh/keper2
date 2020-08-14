import * as functions from 'firebase-functions';
import {cors} from '../commons/cors';

export const health = functions.https.onRequest((request, response) => {
  functions.logger.info(`Health says: Just fine`, {structuredData: true});

  return cors(request, response, async () => {
    response.status(200).send({ health: `Just fine` });
  })
});
