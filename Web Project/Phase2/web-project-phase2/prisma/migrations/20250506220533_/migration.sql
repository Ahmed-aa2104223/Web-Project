/*
  Warnings:

  - You are about to drop the column `prerequisite` on the `CourseDefinition` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Prerequisite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "courseId" INTEGER NOT NULL,
    "prerequisiteId" INTEGER NOT NULL,
    CONSTRAINT "Prerequisite_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "CourseDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Prerequisite_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "CourseDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourseDefinition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "courseName" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "creditHour" INTEGER NOT NULL
);
INSERT INTO "new_CourseDefinition" ("courseCode", "courseName", "creditHour", "id") SELECT "courseCode", "courseName", "creditHour", "id" FROM "CourseDefinition";
DROP TABLE "CourseDefinition";
ALTER TABLE "new_CourseDefinition" RENAME TO "CourseDefinition";
CREATE UNIQUE INDEX "CourseDefinition_courseCode_key" ON "CourseDefinition"("courseCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
