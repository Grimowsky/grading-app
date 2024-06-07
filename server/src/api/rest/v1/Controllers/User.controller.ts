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
        res.send({ data: users });
    };
}
