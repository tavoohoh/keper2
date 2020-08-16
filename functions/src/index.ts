import * as admin from 'firebase-admin';

admin.initializeApp();

export { health } from './routes/health.route';
export { groups } from './routes/group.route';
export { tasks } from './routes/task.route';

// TODO: delete hateno app and update keper to Blaze
