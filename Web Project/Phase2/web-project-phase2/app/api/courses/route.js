import CourseRepo from "@/app/repo/CourseRepo"

export async function GET(request) {
    const courses = await CourseRepo.getAllCourses()
    return Response.json(courses)
}


export async function POST(request) {

    const course = await request.json()
    console.log(course);
    const newCourse = await CourseRepo.addCourseOffering(course)
    return Response.json(newCourse)

}