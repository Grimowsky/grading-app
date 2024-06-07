import { Router } from 'express';
import createUserRoutes from './User.routes';

const apiV1 = Router();
apiV1.use('/users', createUserRoutes());

export default apiV1;
