import { Service } from 'typedi';
import {
    type AppReq,
    type AppRes,
} from '../../../../common/types/Request.type';
import { UserService } from '@services/User.service';

@Service()
export class UserController {
    private readonly user: UserService;
    constructor(userService: UserService) {
        this.user = userService;
    }

    getUsersList = async (_req: AppReq, res: AppRes): Promise<void> => {
        const users = await this.user.getUserList();
        res.status(200).send({ data: users });
    };

    getUserById = async (req: AppReq, res: AppRes): Promise<void> => {
        const id = req.params.id;
        const user = await this.user.getUserById(id);

        res.status(200).send(user);
    };
}
