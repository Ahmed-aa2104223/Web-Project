
import React from 'react'
import CourseRepo from '../repo/CourseRepo';
import {getStudentsAction} from '../actions/server-actions'

export default async function page() {

    const students = await getStudentsAction();

    

    return (
        <div>
      <h1>Students</h1>
      <ul>
        {students?.map((student) => (
          <li key={student.id}>
            {student.firstName} {student.lastName} - {student.email}
          </li>
        ))}
      </ul>
    </div>
    )
}
