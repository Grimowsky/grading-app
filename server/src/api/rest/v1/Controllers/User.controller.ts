import { Service } from 'typedi';
import {
    type AppReq,
    type AppRes,
} from '../../../../common/types/Request.type';
import { UserService } from '@services/User.service';
import { type User } from '../../../../prisma/client';
import { StatusCodes } from 'http-status-codes';

@Service()
export class UserController {
    private readonly user: UserService;
    constructor(userService: UserService) {
        this.user = userService;
    }

    getUsersList = async (_req: AppReq, res: AppRes): Promise<void> => {
        const users = await this.user.getUserList();
        res.status(StatusCodes.OK).send({ data: users });
    };

    getUserById = async (req: AppReq, res: AppRes): Promise<void> => {
        const id = req.params.id;
        const user = await this.user.getUserById(id);

        res.status(StatusCodes.OK).send(user);
    };

    addUser = async (req: AppReq, res: AppRes): Promise<void> => {
        const user = req.body as User;

        await this.user.addUser(user);

        res.status(StatusCodes.CREATED).send(user);
    };
}
