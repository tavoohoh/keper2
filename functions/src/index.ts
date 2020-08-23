import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: 'https://keper-app.firebaseio.com'
});

export { health } from './routes/health.route';
export { groups } from './routes/group.route';
export { tasks } from './routes/task.route';
export { users } from './routes/user.route';
export { members } from './routes/member.route';

// TODO: delete hateno app and update keper to Blaze
