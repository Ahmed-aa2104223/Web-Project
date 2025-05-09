import CourseRepo from "@/app/repo/CourseRepo"

export async function GET(request) {
    const instructor = await CourseRepo.getInstructors()
    return Response.json(instructor)
}

export async function POST(request) {

    const instructor = await request.json()
    console.log(instructor);
    const newInstructor = await CourseRepo.addInstructor(instructor)
    return Response.json(newInstructor)
}