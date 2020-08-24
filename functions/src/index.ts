import * as admin from 'firebase-admin';
import * as firabase from 'firebase';
import * as serviceAccount from './serviceAccountKey.json';
import * as firebaseConfig from './firebaseConfig.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: 'https://keper-app.firebaseio.com'
});

firabase.initializeApp(firebaseConfig);

export { health } from './routes/health.route';
export { groups } from './routes/group.route';
export { tasks } from './routes/task.route';
export { users } from './routes/user.route';
export { members } from './routes/member.route';

// TODO: delete hateno app and update keper to Blaze
