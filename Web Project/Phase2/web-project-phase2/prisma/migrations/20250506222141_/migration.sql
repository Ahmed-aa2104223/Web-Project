/*
  Warnings:

  - The primary key for the `CourseDefinition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CourseOffering` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Instructor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Prerequisite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `StudentCourse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourseDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseName" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "creditHour" INTEGER NOT NULL
);
INSERT INTO "new_CourseDefinition" ("courseCode", "courseName", "creditHour", "id") SELECT "courseCode", "courseName", "creditHour", "id" FROM "CourseDefinition";
DROP TABLE "CourseDefinition";
ALTER TABLE "new_CourseDefinition" RENAME TO "CourseDefinition";
CREATE UNIQUE INDEX "CourseDefinition_courseCode_key" ON "CourseDefinition"("courseCode");
CREATE TABLE "new_CourseOffering" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "CRN" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "instructorId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    CONSTRAINT "CourseOffering_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CourseOffering_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "CourseDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CourseOffering" ("CRN", "approved", "courseId", "id", "instructorId", "seats", "status") SELECT "CRN", "approved", "courseId", "id", "instructorId", "seats", "status" FROM "CourseOffering";
DROP TABLE "CourseOffering";
ALTER TABLE "new_CourseOffering" RENAME TO "CourseOffering";
CREATE UNIQUE INDEX "CourseOffering_CRN_key" ON "CourseOffering"("CRN");
CREATE TABLE "new_Instructor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expertise" TEXT NOT NULL
);
INSERT INTO "new_Instructor" ("email", "expertise", "id", "name") SELECT "email", "expertise", "id", "name" FROM "Instructor";
DROP TABLE "Instructor";
ALTER TABLE "new_Instructor" RENAME TO "Instructor";
CREATE UNIQUE INDEX "Instructor_email_key" ON "Instructor"("email");
CREATE TABLE "new_Prerequisite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "prerequisiteId" TEXT NOT NULL,
    CONSTRAINT "Prerequisite_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "CourseDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Prerequisite_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "CourseDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Prerequisite" ("courseId", "id", "prerequisiteId") SELECT "courseId", "id", "prerequisiteId" FROM "Prerequisite";
DROP TABLE "Prerequisite";
ALTER TABLE "new_Prerequisite" RENAME TO "Prerequisite";
CREATE TABLE "new_StudentCourse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "StudentCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StudentCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "CourseOffering" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StudentCourse" ("courseId", "grade", "id", "status", "studentId") SELECT "courseId", "grade", "id", "status", "studentId" FROM "StudentCourse";
DROP TABLE "StudentCourse";
ALTER TABLE "new_StudentCourse" RENAME TO "StudentCourse";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "state" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "password", "state") SELECT "email", "id", "password", "state" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
