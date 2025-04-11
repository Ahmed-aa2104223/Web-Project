// retrieve student info
const email = localStorage.getItem("email");
const studentCourses = JSON.parse(localStorage.getItem("studentCourses"));
const allCourses = JSON.parse(localStorage.getItem("courses"));
const registration = JSON.parse(localStorage.getItem("registration"));
const students = JSON.parse(localStorage.getItem("students"));
const course = JSON.parse(localStorage.getItem("courseJSON"));



// selectors
const course_list = document.querySelector("#course_list");

// Function to show a dialog box for messages (error or success)
// The dialog will appear centered on the screen.
function showDialog(message, callback) {
    let dialog = document.createElement("dialog");
    // Style the dialog to appear centered
    dialog.style.position = "fixed";
    dialog.style.top = "50%";
    dialog.style.left = "50%";
    dialog.style.transform = "translate(-50%, -50%)";
    dialog.style.padding = "20px";
    dialog.style.borderRadius = "5px";
    dialog.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    dialog.innerHTML = `
        <p>${message}</p>
        <button id="closeDialog" style="padding :10px">Close</button>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.querySelector("#closeDialog").addEventListener("click", function() {
        dialog.close();
        document.body.removeChild(dialog);
        if (callback) {
            callback();
        }
    });
}

course_list.addEventListener("submit", register);

read();

// registration
async function register(input) {
    const CRN = input;
    
    // Check if the student is already registered for this course.
    const isDuplicate = await dups(CRN);
    if (isDuplicate) {
        showDialog("You are already registered for this course.");
        return;
    }
    
    // Retrieve the registration record for the given CRN.
    const regRecord = registration.find(element => element.CRN == CRN);
    if (!regRecord) {
        showDialog("Course registration information not found.");
        return;
    }
    
    // Check for available seats.
    const availableSeats = regRecord.seats;
    if (countSeats(CRN) >= availableSeats) {
        showDialog("No seats available.");
        return;
    }
    
    // Check if the student is qualified (has passed all prerequisites) and the course is open.
    const qualified = await isQualified(CRN);
    if (!qualified) {
        if (regRecord.status !== "open") {
            showDialog("The course is not open for registration.");
        } else {
            showDialog("You have not passed all prerequisites required for this course.");
        }
        return;
    }
    
    // All checks passed; proceed with registration.
    const studentID = students.find(student => student.email == email);
    
    let newCourse = {
        "course_code": regRecord.course_code,
        "CRN" : `${CRN}`,
        "grade": "N/A",
        "status": "Pending"
    };
    studentID.courses.push(newCourse);
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("studentCourses", JSON.stringify(studentID.courses));
    
    // Update the course's student list.
    const registerCourse = course.find(element => element.CRN == CRN);
    let newStudent = {
        "id": studentID.id,
        "grade": "N/A"
    };
    registerCourse.students.push(newStudent);
    localStorage.setItem("courseJSON", JSON.stringify(course));
    
    course_list.innerHTML = "";
    read();
    // Show a success message in a dialog box.
    showDialog("You have successfully registered!", function() {
        window.location = window.location.href;
    });
}

// check for duplicate registration
async function dups(CRN) {
    const course_code = registration.find((element) => element.CRN == CRN).course_code;
    if (studentCourses.find(element => element.course_code == course_code)) {
        return true;
    } else {
        return false;
    }
}

// check whether the student is qualified to register for the course
async function isQualified(CRN) {
    const regRecord = registration.find((element) => element.CRN == CRN);
    const course_code = regRecord.course_code;
    const courseStatus = regRecord.status;
    
    // Only open courses are allowed. 
    if (courseStatus !== "open") {
         return false;
    }
    
    // Special case for CMPS 493: requires either CMPS 310 and CMPS 350 OR CMPS 310 and CMPS 405 (all must be completed)
    if (course_code === "CMPS 493") {
         const studentPassedCourses = studentCourses
                                        .filter(e => e.status === "Completed")
                                        .map(e => e.course_code);
         const preq1 = ["CMPS 310", "CMPS 350"];
         const preq2 = ["CMPS 310", "CMPS 405"];
         if (preq1.every(code => studentPassedCourses.includes(code)) || 
             preq2.every(code => studentPassedCourses.includes(code))) {
              return true;
         } else {
              return false;
         }
    }
    
    // Retrieve course details.
    const courseDetails = allCourses.find((element) => element.course_code == course_code);
    const preq = courseDetails.prerequisite; // may be null, string, or array
    const conpreq = courseDetails.concurrent_prerequisite; // may be null or a string
    
    // If no prerequisite is specified, check if there is a concurrent prerequisite. Faisal: we dont need to complete the course
    if (!preq) {
         if (conpreq) {
             // Allow registration only if the concurrent course has been passed.
             if (studentCourses.find(e => e.course_code === conpreq /*&& e.status === "Completed"*/)) {
                  return true;
             } else {
                  return false;
             }
         }
         return true;
    }
    
    // If prerequisite is a string, ensure the student has passed it.
    if (typeof preq === "string") {
         return !!studentCourses.find(e => e.course_code === preq /*&& e.status === "Completed"*/);
    }
    
    // If prerequisite is an array, ensure the student has passed all courses.
    if (Array.isArray(preq)) {
         let allPassed = preq.every(code => studentCourses.find(e => e.course_code === code /*&& e.status === "Completed"*/));
         return allPassed;
    }
    
    return false;
}

// count seats
function countSeats(CRN) {
    const registerCourse = course.find(element => element.CRN == CRN);
    const count = registerCourse.students.length;
    return count;
}

// save the registration details and render the courses list
async function read() {
    localStorage.setItem("students", JSON.stringify(students));
    registration.forEach((e) => {
        const count = countSeats(e.CRN);
        e.course_name = allCourses.find((element) => element.course_code == e.course_code).course_name;
        e.credit_hour = allCourses.find((element) => element.course_code == e.course_code).credit_hour;
        e.actual_seats = e.seats - count;
        course_list.innerHTML += renderCourses(e);
    });
}

// render the courses list
function renderCourses(data) {
    if (!data.course_name == "") {
       return `<div class="card">
        <h2>${data.status}</h2>
        <h4>${data.course_name}</h4>
        <h4>${data.course_code}</h4>
        <h4>${data.credit_hour} Credit Hour</h4>
        <h4>Instructor: ${data.instructor}</h4>
        <h4>${data.actual_seats}/${data.seats} Seats</h4>
        <h4>${data.CRN}</h4>
        <form>
            <input type="submit" value="Register" onClick="event.preventDefault();register(${data.CRN})"></input>
        </form>
        </div> ` 
    }
}





// return `<tr value="${data.status}" id="${data.CRN}">
// <td class="course_name">${data.course_name}</td>
// <td class="course_code">${data.course_code}</td>
// <td class="credit_hour">${data.credit_hour}</td>
// <td class="instructor">${data.instructor}</td>
// <td class="seats">${data.actual_seats}/${data.seats}</td>
// <td class="CRN">${data.CRN}</td>
// <td>
//     <form>
//         <input type="submit" value="Register" onClick="event.preventDefault();register(${data.CRN})">
//     </form>
// </td>
// </tr>`;