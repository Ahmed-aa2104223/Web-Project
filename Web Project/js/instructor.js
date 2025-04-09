// Retrieve instructors and course data (using course.json stored in localStorage)
const instructors = JSON.parse(localStorage.getItem("instructorsJSON"));
const courses = JSON.parse(localStorage.getItem("courseJSON")); // course.json data is used here

// Retrieve the logged-in instructor's email from localStorage
const email = localStorage.getItem("email");

// Select DOM elements
const instructorInfo = document.querySelector("#nameinstructor");
const classesSection = document.querySelector("#courses");
retrieveInstructor();

function retrieveInstructor() {
  let inst = instructors.find(el => el.email.toLowerCase() === email.toLowerCase());
  if (!inst) {
    instructorInfo.innerHTML = `<h2>Instructor not found!</h2>`;
    return;
  }
  
  instructorInfo.innerHTML = `
    <h2>WELCOME ${inst.name}</h2>
    <h3>Expertise: ${inst.expertise}</h3>
  `;
  
  if (inst.CRNS) {
    let crnsArray = Array.isArray(inst.CRNS) ? inst.CRNS : [inst.CRNS];
    displayClassesByCRN(crnsArray);
  } else {
    displayClassesByName(inst.name);
  }
}

function displayClassesByCRN(crns) {
  classesSection.innerHTML = "";
  let crnsArray = crns.map(c => c.toString());
  let myClasses = courses.filter(c => crnsArray.includes(c.CRN.toString()));
  renderClasses(myClasses);
}

function displayClassesByName(instructorName) {
  classesSection.innerHTML = "";
  let myClasses = courses.filter(c => (c.instructor_name || "").toLowerCase() === instructorName.toLowerCase());
  renderClasses(myClasses);
}

function renderClasses(myClasses) {
  if (!myClasses || myClasses.length === 0) {
    classesSection.innerHTML = "<p>No classes assigned.</p>";
    return;
  }
  
  const fragment = document.createDocumentFragment();
  
  myClasses.forEach(record => {
    let crn = record.CRN || "N/A";
    let instructorName = record.instructor_name || "N/A";
    let tableHTML = `
      <table class="grade-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Final Grade</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    if (record.students && record.students.length > 0) {
      record.students.forEach((student) => {
        let studentID = typeof student === 'object' ? student.id : student;
        let selectedGrade = (typeof student === 'object' && student.grade) ? student.grade : "";
        tableHTML += `
          <tr>
            <td>
              <input type="text" name="studentID" value="${studentID}" readonly>
            </td>
            <td>
              <select name="finalGrade">
                <option value="">Select Grade</option>
                <option value="A" ${selectedGrade === 'A' ? 'selected' : ''}>A</option>
                <option value="B+" ${selectedGrade === 'B+' ? 'selected' : ''}>B+</option>
                <option value="B" ${selectedGrade === 'B' ? 'selected' : ''}>B</option>
                <option value="C+" ${selectedGrade === 'C+' ? 'selected' : ''}>C+</option>
                <option value="C" ${selectedGrade === 'C' ? 'selected' : ''}>C</option>
                <option value="D+" ${selectedGrade === 'D+' ? 'selected' : ''}>D+</option>
                <option value="D" ${selectedGrade === 'D' ? 'selected' : ''}>D</option>
                <option value="F" ${selectedGrade === 'F' ? 'selected' : ''}>F</option>
              </select>
            </td>
          </tr>
        `;
      });
    } else {
      tableHTML += `
        <tr>
          <td colspan="2">No students enrolled.</td>
        </tr>
      `;
    }
    
    tableHTML += `
        </tbody>
      </table>
    `;
    
    let cardHTML = `
      <div class="class-card" data-crn="${crn}">
        <h3>CRN: ${crn}</h3>
        <p>Instructor: ${instructorName}</p>
        <h4>Submit Final Grades</h4>
        <form class="grade-form">
          ${tableHTML}
          <button type="submit" class="submit-btn">Submit Grades</button>
        </form>
      </div>
    `;
    
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cardHTML;
    fragment.appendChild(tempDiv.firstElementChild);
  });
  
  classesSection.innerHTML = "";
  classesSection.appendChild(fragment);
  
  const gradeForms = document.querySelectorAll(".grade-form");
  gradeForms.forEach(form => {
    form.addEventListener("submit", submitGrades);
  });
}


function submitGrades(e) {
  e.preventDefault();
  const form = e.target;
  const classCard = form.closest(".class-card");
  const crn = classCard.getAttribute("data-crn");
  let record = courses.find(r => r.CRN == crn);
  if (!record) return;
  
  const rows = form.querySelectorAll("tbody tr");
  const updatedStudents = [];
  
  rows.forEach(row => {
    const studentIDField = row.querySelector("input[name='studentID']");
    const gradeSelect = row.querySelector("select[name='finalGrade']");
    const studentID = studentIDField.value.trim();
    const finalGrade = gradeSelect.value;
    if (studentID) {
      updatedStudents.push({
        id: studentID,
        grade: finalGrade
      });
    }
  });
  
  record.students = updatedStudents;
  localStorage.setItem("courseJSON", JSON.stringify(courses));
  alert("Grades submitted successfully for CRN " + crn);
}
