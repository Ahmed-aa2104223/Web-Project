import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class CourseRepo {

  // User methods
  async addUser(user) {
    return await prisma.user.create({ data: user });
  }

  async getUserByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async getUsers(type) {
    if(type == 'student' || type == 'instructor' || type == 'administrator'){
      return await prisma.user.findMany({
        where : {state:type}
      });
    }
    return await prisma.user.findMany();
  }

  // Instructor methods
  async addInstructor(instructor) {
    return await prisma.instructor.create({ data: instructor });
  }

  async getInstructors() {
    return await prisma.instructor.findMany();
  }

  async getStudents() {
    return await prisma.student.findMany({
      include: {courses:true}
    });
  }

  async getInstructorWithCourses(id) {
    return await prisma.instructor.findUnique({
      where: { id },
      include: { offerings: true }
    });
  }

  // Student methods
  async addStudent(student) {
    return await prisma.student.create({ data: student });
  }

  async enrollStudent(studentId, courseOfferingId, status = 'enrolled') {
    const studentCourse = {
      studentId,
      courseId: courseOfferingId,
      status,
      grade: 'N/A'
    };
    return await prisma.studentCourse.create({ data: studentCourse });
  }

  async getAllStudents() {
    return await prisma.student.findMany();
  }


  async getStudentCourses(studentId) {
    return await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        courses: {
          include: { course: true }
        }
      }
    });
  }

  // CourseDefinition methods
  async addCourseDefinition(course) {
    return await prisma.courseDefinition.create({ data: course });
  }

  async getAllCourses() {
    return await prisma.courseDefinition.findMany({
      include: { offerings: true, prerequisites: true }
    });
  }

  // CourseOffering methods
  async addCourseOffering(offering) {
    return await prisma.courseOffering.create({ data: offering });
  }

  async updateCourseOffering(CRN, data) {
    return await prisma.courseOffering.update({
      where: { CRN },
      data
    });
  }

  async getCourseOffering(CRN) {
    return await prisma.courseOffering.findUnique({
      where: { CRN },
      include: { students: true }
    });
  }

  // Prerequisite methods
  async addPrerequisite(courseId, prerequisiteId) {
    return await prisma.prerequisite.create({
      data: {
        courseId,
        prerequisiteId
      }
    });
  }

  async getCourseWithPrerequisites(id) {
    return await prisma.courseDefinition.findUnique({
      where: { id },
      include: {
        prerequisites: {
          include: { prerequisite: true }
        }
      }
    });
  }

  // Reporting
  async getEnrollmentReport() {
    const courseStats = await prisma.studentCourse.groupBy({
      by: ['courseId'],
      _count: true,
      _avg: { grade: true },
      _min: { grade: true },
      _max: { grade: true }
    });
    return courseStats;
  }
}

export default new CourseRepo();
