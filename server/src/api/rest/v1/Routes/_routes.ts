import { Router } from 'express';
import createUserRoutes from './User.routes';
import createCourseRoutes from './Course.routes';

const apiV1 = Router();
apiV1.use('/users', createUserRoutes()).use('/courses', createCourseRoutes());

export default apiV1;
