import CourseRepo from "@/app/repo/CourseRepo"

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('state')

    const users = await CourseRepo.getUsers(type)

    return Response.json(users)
}

export async function POST(request) {

    const user = await request.json()
    console.log(user);
    const newUser = await CourseRepo.addUser(user)
    return Response.json(newUser)

}