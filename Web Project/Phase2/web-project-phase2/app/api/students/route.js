import CourseRepo from "@/app/repo/CourseRepo"

export async function GET(request) {
    const students = await CourseRepo.getStudents()
    return Response.json(students)
}

export async function POST(request) {

    const student = await request.json()
    console.log(student);
    const newStudent = await CourseRepo.addStudent(student)
    return Response.json(newStudent)
}