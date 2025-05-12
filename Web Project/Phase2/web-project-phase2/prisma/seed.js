import { PrismaClient } from "@prisma/client"
import fs from "fs-extra"
import path from "path"

const prisma = new PrismaClient()

async function seed() {
    console.log("\u2728 Seeding Started...")

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
        instructorsMap[instructor.email] = createdInstructor.id
    }

    // Seed CourseDefinitions
    const courseDefinitionsMap = {}
    for (const course of courses) {
        const courseDef = await prisma.courseDefinition.upsert({
            where: { courseCode: course.course_code },
            update: {},
            create: {
                courseCode: course.course_code,
                courseName: course.course_name,
                creditHour: course.credit_hour,
            }
        })
        courseDefinitionsMap[course.course_code] = courseDef.id
    }

    // Seed Prerequisites
    for (const course of courses) {
        const courseDef = await prisma.courseDefinition.findUnique({
            where: { courseCode: course.course_code }
        })

        if (courseDef && course.prerequisite) {
            const prereqs = Array.isArray(course.prerequisite)
                ? course.prerequisite
                : [course.prerequisite]

            for (const code of prereqs) {
                const prerequisite = await prisma.courseDefinition.findUnique({
                    where: { courseCode: code }
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
    }

    // Seed CourseOfferings
    for (const reg of registrations) {
        const matchedUser = users.find(
            u => u.state === "instructor" && u.email.toLowerCase().includes(reg.instructor.toLowerCase())
        )
        const instructorId = matchedUser ? instructorsMap[matchedUser.email] : undefined

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
        } else {
            console.warn(`Missing instructor or courseDef for CRN ${reg.CRN}`)
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
            } else {
                console.warn(`Offering not found for CRN: ${course.CRN}`)
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
    console.log("\u2705 Seeding Completed")
}

seed().catch((e) => {
    console.error(e)
    prisma.$disconnect()
})