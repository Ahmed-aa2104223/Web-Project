'use client'
import React, { useEffect, useState } from 'react';
import {
  getFailingStudents,
  getStudentsWithGPAUnder,
  getTopPerformingStudents,
  getCourseEnrollmentCount,
  getAverageGradePerCourse,
  getStudentCountPerInstructor,
  getMostPopularCourses,
  getCoursesCompletedByStudent,
  getStudentsEnrolledInCourse,
  getCourseFailRate
} from '@/app/actions/server-actions';
import StatCard from '../component/Card';

export default function StatisticsCardsPage() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function loadStats() {
      const lowGPA = await getStudentsWithGPAUnder(2.5);
      const top = await getTopPerformingStudents(3);
      const failing = await getFailingStudents();
      const avgGrades = await getAverageGradePerCourse();
      const instructors = await getStudentCountPerInstructor();
      const popular = await getMostPopularCourses(3);
      const completed = await getCoursesCompletedByStudent('202205767');
      const enrolled = await getStudentsEnrolledInCourse('22151');
      const failRate = await getCourseFailRate('22151');
      const enrollmentCount = await getCourseEnrollmentCount('22151');

      setStats([
        {
          title: 'Students w/ GPA < 2.5',
          content: `${lowGPA.length} student(s)`
        },
        {
          title: 'Top 3 Students',
          content: top.map(s => `${s.name} - GPA: ${s.GPA}`).join('\n')
        },
        {
          title: 'Failing Students',
          content: `${failing.length} student(s)`
        },
        {
          title: 'Average Grade / Course',
          content: avgGrades
          .filter(a => a.averageGrade !== 'N/A')   
          .slice(0, 3)
          .map(a => `${a.CRN}: ${a.averageGrade}`)
          .join('\n')
        },
        {
          title: 'Students / Instructor',
          content: instructors.slice(0, 3).map(i => `${i.instructor}: ${i.totalStudents}`).join('\n')
        },
        {
          title: 'Most Popular Courses',
          content: popular.map(c => `${c.CRN}: ${c.studentCount}`).join('\n')
        },
        {
          title: 'Courses Completed by 202205767',
          content: completed.map(c => `${c.CRN} (${c.grade})`).join('\n')
        },
        {
          title: 'Students in CRN 22151',
          content: enrolled.map(s => `${s.name}`).join('\n')
        },
        {
          title: 'Fail Rate (CRN 22151)',
          content: failRate
        },
        {
          title: 'Enrollment Count (CRN 22151)',
          content: `${enrollmentCount} student(s)`
        }
      ]);
    }
    loadStats();
  }, []);

  return (
    <div className="courses">
      <h1>Course Statistics</h1>
      <div className="card-container">
        {stats.map((s, i) => (
          <StatCard key={i} title={s.title} content={s.content} />
        ))}
      </div>
    </div>
  );
}
