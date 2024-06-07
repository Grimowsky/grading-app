import { z } from 'zod';

const createUserValidator = z.object({
    body: z.object({
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
        social: z
            .object({
                twitter: z.string(),
                facebook: z.string(),
            })
            .optional(),
    }),
});

const UserValidators = {
    createUserValidator,
};

export default UserValidators;
