import { PrismaClient } from "@prisma/client"
import fs from "fs-extra"
import path from "path"

const prisma = new PrismaClient()

async function seed() {
    console.log("🌱 Seeding Started...")

    const instructors = await fs.readJSON(path.join(process.cwd(), "app/data/instructors.json"))
    const registrations = await fs.readJSON(path.join(process.cwd(), "app/data/registration.json"))
    const courses = await fs.readJSON(path.join(process.cwd(), "app/data/courses.json"))
    const studentData = await fs.readJSON(path.join(process.cwd(), "app/data/students.json"))
    const users = await fs.readJSON(path.join(process.cwd(), "app/data/users.json"))

    // Seed Users
    for (const user of users) {
        await prisma.user.create({ data: user })
    }

    // Seed Instructors
    const instructorsMap = {}
    for (const instructor of instructors) {
        const createdInstructor = await prisma.instructor.create({
            data: {
                name: instructor.name,
                email: instructor.email,
                expertise: instructor.expertise,
            }
        })
        instructorsMap[instructor.email] = createdInstructor.id // Map emails to instructor IDs
    }

    // Seed CourseDefinitions with upsert to handle duplicates
    const courseDefinitionsMap = {}
    for (const course of courses) {
        const courseDef = await prisma.courseDefinition.upsert({
            where: { courseCode: course.course_code },
            update: {},  // If courseCode exists, do nothing
            create: {
                courseCode: course.course_code,
                courseName: course.course_name,
                creditHour: course.credit_hour,
            }
        })
        courseDefinitionsMap[course.course_code] = courseDef.id // Map courseCodes to course IDs
    }

    // Seed Prerequisites
    for (const course of courses) {
        console.log(`Processing course: ${course.course_code}`); // Log the course code

        // Ensure course_code is a single value
        if (Array.isArray(course.course_code)) {
            console.error(`Invalid course_code: ${course.course_code}`);
            continue; // Skip this iteration if the course_code is invalid
        }

        const courseDef = await prisma.courseDefinition.findUnique({
            where: { courseCode: course.course_code } // Querying one courseCode at a time
        })

        if (courseDef && course.prerequisite) {
            console.log(`Looking for prerequisite: ${course.prerequisite}`); // Log prerequisite

            // Ensure prerequisite is a single value
            if (Array.isArray(course.prerequisite)) {
                console.error(`Invalid prerequisite: ${course.prerequisite}`);
                continue; // Skip if the prerequisite is an array
            }

            const prerequisite = await prisma.courseDefinition.findUnique({
                where: { courseCode: course.prerequisite } // Querying one prerequisite courseCode at a time
            })

            if (prerequisite) {
                await prisma.prerequisite.create({
                    data: {
                        courseId: courseDef.id,
                        prerequisiteId: prerequisite.id
                    }
                })
            }
        }
    }



    // Seed CourseOfferings
    for (const reg of registrations) {
        const instructorId = instructorsMap[`${reg.instructor.toLowerCase()}@qu.edu.qa`]
        const courseDef = await prisma.courseDefinition.findUnique({
            where: { courseCode: reg.course_code }
        })

        if (instructorId && courseDef) {
            await prisma.courseOffering.create({
                data: {
                    CRN: reg.CRN,
                    status: reg.status,
                    seats: reg.seats,
                    approved: reg.approved,
                    instructorId: instructorId,
                    courseId: courseDef.id,
                }
            })
        }
    }

    // Seed Students
    for (const student of studentData) {
        const enrolledCourses = []
        for (const course of student.courses) {
            const offering = await prisma.courseOffering.findUnique({
                where: { CRN: course.CRN }
            })
            if (offering) {
                enrolledCourses.push({
                    courseId: offering.id,
                    grade: course.grade,
                    status: course.status
                })
            }
        }

        await prisma.student.create({
            data: {
                id: student.id,
                name: student.name,
                email: student.email,
                GPA: student.GPA,
                courses: {
                    create: enrolledCourses
                }
            }
        })
    }

    await prisma.$disconnect()
    console.log("✅ Seeding Completed")
}

seed().catch((e) => {
    console.error(e)
    prisma.$disconnect()
})
