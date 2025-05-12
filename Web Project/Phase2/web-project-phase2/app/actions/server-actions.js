'use server'

import CourseRepo from "../repo/CourseRepo"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getFailingStudents() {
  return await CourseRepo.getFailingStudents();
}

export async function getStudentsWithGPAUnder(threshold = 2.5) {
  return await CourseRepo.getStudentsWithGPAUnder(threshold);
}

export async function getTopPerformingStudents(limit = 5) {
  return await CourseRepo.getTopPerformingStudents(limit);
}

export async function getCourseEnrollmentCount(CRN) {
  return await CourseRepo.getCourseEnrollmentCount(CRN);
}

export async function getAverageGradePerCourse() {
  return await CourseRepo.getAverageGradePerCourse();
}

export async function getStudentCountPerInstructor() {
  return await CourseRepo.getStudentCountPerInstructor();
}

export async function getMostPopularCourses(limit = 5) {
  return await CourseRepo.getMostPopularCourses(limit);
}

export async function getStudentsEnrolledInCourse(CRN) {
  return await CourseRepo.getStudentsEnrolledInCourse(CRN);
}

export async function getCoursesCompletedByStudent(studentId) {
  return await CourseRepo.getCoursesCompletedByStudent(studentId);
}

export async function getCourseFailRate(CRN) {
  return await CourseRepo.getCourseFailRate(CRN);
}


