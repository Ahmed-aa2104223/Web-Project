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

  async getStudentsWithGPAUnder(threshold = 2.5) {
    return await prisma.student.findMany({
      where: { GPA: { lt: threshold } }
    });
  }

  async getTopPerformingStudents(limit = 5) {
    return await prisma.student.findMany({
      orderBy: { GPA: 'desc' },
      take: limit
    });
  } 

  async getFailingStudents() {
    return await prisma.student.findMany({
      where: {
        courses: {
          some: { grade: 'F' }
        }
      },
      include: { courses: true }
    });
  }

  async getCourseEnrollmentCount(CRN) {
    const course = await prisma.courseOffering.findUnique({
        where: { CRN },
        include: { students: true }
    });
    return course?.students.length ?? 0;
  }

  async getAverageGradePerCourse() {
    const offerings = await prisma.courseOffering.findMany({
      include: { students: true }
    });

    const gradeMap = { A: 4, B: 3, C: 2, D: 1, F: 0 };

    return offerings.map(o => {
      const grades = o.students
        .map(s => gradeMap[s.grade?.toUpperCase()] ?? null)
        .filter(g => g !== null);

      const avg = grades.length
        ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)
        : 'N/A';

      return { CRN: o.CRN, averageGrade: avg };
    });
  }

  async getStudentCountPerInstructor() {
    const instructors = await prisma.instructor.findMany({
      include: {
        offerings: {
          include: { students: true }
        }
      }
    });

    return instructors.map(i => ({
      instructor: i.name,
      totalStudents: i.offerings.reduce((acc, o) => acc + o.students.length, 0)
  }));
  } 

  async getMostPopularCourses(limit = 5) {
    const offerings = await prisma.courseOffering.findMany({
      include: { students: true }
    });

    return offerings
      .map(o => ({ CRN: o.CRN, studentCount: o.students.length }))
      .sort((a, b) => b.studentCount - a.studentCount)
      .slice(0, limit);
  }

  async getStudentsEnrolledInCourse(CRN) {
    const offering = await prisma.courseOffering.findUnique({
      where: { CRN },
      include: {
        students: {
          include: { student: true }
        }
      }
    });

    return offering?.students.map(sc => sc.student) || [];
  }
  
  async getCoursesCompletedByStudent(studentId) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        courses: {
          where: { status: 'Completed' },
          include: { course: true }
        }
      }
    });

    return student?.courses.map(c => ({
      CRN: c.course.CRN,
      grade: c.grade
    })) || [];
  }

  async getCourseFailRate(CRN) {
    const offering = await prisma.courseOffering.findUnique({
      where: { CRN },
      include: { students: true }
    });

    if (!offering || offering.students.length === 0) return 'N/A';
    const fails = offering.students.filter(s => s.grade === 'F').length;
    return ((fails / offering.students.length) * 100).toFixed(1) + '%';
} 

}

export default new CourseRepo();
