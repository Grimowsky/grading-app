-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "courseDetails" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TestResult" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
