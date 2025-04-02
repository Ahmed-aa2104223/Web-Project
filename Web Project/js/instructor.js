// Retrieve instructors, courses, and classes data from localStorage
const instructors = JSON.parse(localStorage.getItem("instructorsJSON"));
const coursesData = JSON.parse(localStorage.getItem("courses")); // Course details
const classesData = JSON.parse(localStorage.getItem("courseJSON")); // Classes info with students

// Retrieve the logged-in instructor's email from localStorage
const email = localStorage.getItem("email");

// Select DOM elements
const instructorInfo = document.querySelector("#nameinstructor");
const coursesSection = document.querySelector("#courses");

// Retrieve and display instructor info and classes
retrieve();

function retrieve() {
    // Find the instructor record based on email
    let filtered = instructors.find(element => element.email.toLowerCase() === email.toLowerCase());
    if (!filtered) return;
    
    // Save instructor's assigned class CRNs (assumed to be stored in the "CRNS" property)
    localStorage.setItem("instructorCourses", JSON.stringify(filtered.CRNS));
    
    // Display instructor info
    instructorInfo.innerHTML = `<h2>WELCOME ${filtered.name}</h2>
                                <h3>Expertise: ${filtered.expertise}</h3>`;
    
    // Display the classes assigned to this instructor and allow grade submission
    displayClasses(filtered.CRNS);
}

function displayClasses(crns) {
    // Clear the courses section
    coursesSection.innerHTML = "";
    
    // Loop through each CRN assigned to the instructor
    crns.forEach(crn => {
        // Find the class object in classesData with matching CRN
        let classObj = classesData.find(c => c.CRN == crn);
        if (!classObj) return;
        
        // Look up course details using the course code from the class record
        let courseDetail = coursesData.find(course => course.course_code === classObj.course_code);
        let courseName = courseDetail ? courseDetail.course_name : classObj.course_code;
        
        // Build the HTML for this class card
        let cardHTML = `
            <div class="class-card" data-crn="${classObj.CRN}">
                <h3>${courseName} (CRN: ${classObj.CRN})</h3>
                <p>Instructor: ${classObj.instructor}</p>
                <p>Status: ${classObj.status}</p>
                <h4>Students & Final Grades</h4>
                <form class="grade-form">
                    <ul>
        `;
        if (classObj.students && classObj.students.length > 0) {
            classObj.students.forEach((student, index) => {
                cardHTML += `
                    <li>
                        Student ID: ${student.id} - Grade: 
                        <input type="text" name="grade" value="${student.grade}" data-index="${index}">
                    </li>
                `;
            });
        } else {
            cardHTML += `<li>No students registered.</li>`;
        }
        cardHTML += `
                    </ul>
                    <button type="submit">Submit Grades</button>
                </form>
            </div>
        `;
        coursesSection.innerHTML += cardHTML;
    });
    
    // Add event listeners for each grade submission form
    const gradeForms = document.querySelectorAll(".grade-form");
    gradeForms.forEach(form => {
        form.addEventListener("submit", submitGrades);
    });
}

function submitGrades(e) {
    e.preventDefault();
    const form = e.target;
    // Find the parent class card to determine which class is being updated
    const classCard = form.closest(".class-card");
    const crn = classCard.getAttribute("data-crn");
    
    // Find the corresponding class object in classesData
    let classObj = classesData.find(c => c.CRN == crn);
    if (!classObj) return;
    
    // For each grade input in the form, update the corresponding student's grade
    const inputs = form.querySelectorAll("input[name='grade']");
    inputs.forEach(input => {
        const index = input.getAttribute("data-index");
        classObj.students[index].grade = input.value.trim();
    });
    
    // Update the courseJSON (classes data) in localStorage
    localStorage.setItem("courseJSON", JSON.stringify(classesData));
    
    alert("Grades submitted successfully for CRN " + crn);
}
