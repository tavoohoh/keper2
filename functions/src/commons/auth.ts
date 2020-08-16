import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * To test authentication first authenticate with email and password, store `idToken` and `refreshToken`.
 * Use `idToken` as `code` and `refreshToken` as `refresh_token` to retrieve the user's `access_token`.
 *
 * Authenticate with email and password: https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
 * Retrieve `access_token`: https://developers.google.com/identity/toolkit/reference/securetoken/rest/v1/token
 */

const unauthorizedError = (response: functions.Response<any>) => {
  const errorMessage = 'Error while verifying authorization';
  functions.logger.error(errorMessage);

  response.status(403).send({
    error: 'Unauthorized',
    message: errorMessage
  });
}

export const authorization = async (request: functions.https.Request, response: functions.Response<any>): Promise<any> => {
  if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
    try {
      const token = request.headers.authorization.split('Bearer ')[1];

      return {
        user: await admin.auth().verifyIdToken(token)
      };
    } catch (error) {
      unauthorizedError(response);
    }
  } else {
    unauthorizedError(response);
  }
}
