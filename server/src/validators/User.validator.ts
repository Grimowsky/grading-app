import { z } from 'zod';
import { UserRole } from '../prisma/client';

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

const updateUserValidator = z.object({
    body: z.object({
        email: z.string().email().optional(),
        firstName: z.string().optional().default(''),
        lastName: z.string().optional().default(''),
        social: z
            .object({
                twitter: z.string(),
                facebook: z.string(),
            })
            .optional(),
    }),
});

const enrollmentValidator = z.object({
    body: z.object({
        role: z.nativeEnum(UserRole),
    }),
});

const UserValidators = {
    createUserValidator,
    updateUserValidator,
    enrollmentValidator,
};

export default UserValidators;
