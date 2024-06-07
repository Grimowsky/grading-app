import { Router, type Router as RouterReturn } from 'express';
import { UserController } from '@controllers/User.controller';
import { Container } from 'typedi';

const UserRoutes = (): RouterReturn => {
    const router = Router();
    const userController = Container.get(UserController);

    router.get('/', userController.getUsersList);
    router.get('/:id');
    router.post('/');
    router.put('/:id');
    router.delete('/:id');
    return router;
};

export default UserRoutes;
