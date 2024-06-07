import { Router, type Router as RouterReturn } from 'express';
import { UserController } from '@controllers/User.controller';
import { Container } from 'typedi';
import RequestValidator from '../../../../middleware/validateRequest';
import UserValidators from '../../../../validators/User.validator';
import { asyncWrapper } from '../../../../middleware/asyncWrapper';

const UserRoutes = (): RouterReturn => {
    const router = Router();
    const userController = Container.get(UserController);

    router.get('/', asyncWrapper(userController.getUsersList));
    router.get('/:id', asyncWrapper(userController.getUserById));
    router.post(
        '/',
        asyncWrapper(RequestValidator(UserValidators.createUserValidator)),
        asyncWrapper(userController.addUser)
    );
    router.put('/:id');
    router.delete('/:id');
    return router;
};

export default UserRoutes;
