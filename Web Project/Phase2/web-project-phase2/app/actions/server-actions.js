'use server'

import CourseRepo from "../repo/CourseRepo"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getStudentsAction(){
    return await CourseRepo.getAllStudents();
}


