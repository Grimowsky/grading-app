import prisma from '../src/prismaClient';
import { add } from 'date-fns';

const weekFromNow = add(new Date(), { days: 7 });
const twoWeekFromNow = add(new Date(), { days: 14 });
const monthFromNow = add(new Date(), { days: 28 });

async function main() {
    await prisma.testResult.deleteMany({});
    await prisma.courseEnrollment.deleteMany({});
    await prisma.test.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.course.deleteMany({});

    const grace = await prisma.user.create({
        data: {
            email: 'grace@hey.com',
            firstName: 'Grace',
            lastName: 'Bell',
            social: {
                facebook: 'gracebell',
                twitter: 'therealgracebell',
            },
        },
    });

    const course = await prisma.course.create({
        data: {
            name: 'CRUD with Prisma',
            tests: {
                create: [
                    {
                        date: weekFromNow,
                        name: 'First test',
                    },
                    {
                        date: twoWeekFromNow,
                        name: 'Second test',
                    },
                    {
                        date: monthFromNow,
                        name: 'Final exam',
                    },
                ],
            },
            members: {
                create: {
                    role: 'TEACHER',
                    user: {
                        connect: {
                            email: grace.email,
                        },
                    },
                },
            },
        },
        include: {
            tests: true,
        },
    });

    const shakuntala = await prisma.user.create({
        data: {
            email: 'devi@prisma.io',
            firstName: 'Shakuntala',
            lastName: 'Devi',
            courses: {
                create: {
                    role: 'STUDENT',
                    course: {
                        connect: { id: course.id },
                    },
                },
            },
        },
    });

    const david = await prisma.user.create({
        data: {
            email: 'david@prisma.io',
            firstName: 'David',
            lastName: 'Deutsch',
            courses: {
                create: {
                    role: 'STUDENT',
                    course: {
                        connect: { id: course.id },
                    },
                },
            },
        },
    });

    const testResultsDavid = [650, 900, 950];
    const testResultsShakuntala = [800, 950, 910];

    let counter = 0;
    for (const test of course.tests) {
        await prisma.testResult.create({
            data: {
                grader: {
                    connect: { email: grace.email },
                },
                student: {
                    connect: { email: shakuntala.email },
                },
                test: {
                    connect: { id: test.id },
                },
                result: testResultsShakuntala[counter],
            },
        });

        await prisma.testResult.create({
            data: {
                grader: {
                    connect: { email: grace.email },
                },
                student: {
                    connect: { email: david.email },
                },
                test: {
                    connect: { id: test.id },
                },
                result: testResultsDavid[counter],
            },
        });

        counter++;
    }
}

main()
    .catch((e: Error) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // Disconnect Prisma Client
        await prisma.$disconnect();
    });
