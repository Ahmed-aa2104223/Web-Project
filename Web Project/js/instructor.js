// Retrieve instructors and registration data from localStorage
const instructors = JSON.parse(localStorage.getItem("instructorsJSON"));
const registrationData = JSON.parse(localStorage.getItem("registration")); // using registration.json data

// Retrieve the logged-in instructor's email from localStorage
const email = localStorage.getItem("email");

// Select DOM elements
const instructorInfo = document.querySelector("#nameinstructor");
const classesSection = document.querySelector("#courses");

// Retrieve and display instructor info and classes
retrieveInstructor();

function retrieveInstructor() {
    // Find the instructor record based on email (case-insensitive)
    let inst = instructors.find(el => el.email.toLowerCase() === email.toLowerCase());
    if (!inst) {
        instructorInfo.innerHTML = `<h2>Instructor not found!</h2>`;
        return;
    }
    
    // Display instructor information
    instructorInfo.innerHTML = `
        <h2>WELCOME ${inst.name}</h2>
        <h3>Expertise: ${inst.expertise}</h3>
    `;
    
    // Use CRNS if available; ensure it's an array
    if (inst.CRNS) {
        let crnsArray = Array.isArray(inst.CRNS) ? inst.CRNS : [inst.CRNS];
        displayClassesByCRN(crnsArray);
    } else {
        // Fallback: filter classes by instructor name
        displayClassesByName(inst.name);
    }
}

// Option 1: Filter classes by CRNs from the instructor record
function displayClassesByCRN(crns) {
    classesSection.innerHTML = "";
    // Convert CRNs to strings for safe comparison
    let crnsArray = crns.map(c => c.toString());
    // Filter registrationData for classes whose CRN is in the instructor's CRNS array
    let myClasses = registrationData.filter(c => crnsArray.includes(c.CRN.toString()));
    renderClasses(myClasses);
}

// Option 2 (fallback): Filter classes by matching instructor name
function displayClassesByName(instructorName) {
    classesSection.innerHTML = "";
    let myClasses = registrationData.filter(
        c => (c.instructor || "").toLowerCase() === instructorName.toLowerCase()
    );
    renderClasses(myClasses);
}

// Render class cards with grade submission forms (stacked vertically)
function renderClasses(myClasses) {
    if (!myClasses || myClasses.length === 0) {
        classesSection.innerHTML = "<p>No classes assigned.</p>";
        return;
    }
    
    // Create a document fragment to accumulate the cards
    const fragment = document.createDocumentFragment();
    
    myClasses.forEach(record => {
        // Use registrationData fields
        let courseCode = record.course_code || "N/A";
        let crn = record.CRN || "N/A";
        let status = record.status || "N/A";
        let seats = record.seats || "N/A";
        
        // Ensure a students array exists
        if (!record.students) {
            record.students = [];
        }
        
        let cardHTML = `
            <div class="class-card" data-crn="${crn}" style="border:1px solid #ccc; padding:1rem; margin:1rem 0; border-radius:5px;">
                <h3 style="margin-top:0;">Course Code: ${courseCode} (CRN: ${crn})</h3>
                <p>Status: ${status}</p>
                <p>Seats: ${seats}</p>
                <h4>Submit Final Grades</h4>
                <form class="grade-form">
                    <table class="grade-table" style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color:#f2f2f2;">
                                <th style="border:1px solid #ddd; padding:0.5rem;">Student Name</th>
                                <th style="border:1px solid #ddd; padding:0.5rem;">Student ID</th>
                                <th style="border:1px solid #ddd; padding:0.5rem;">Final Grade</th>
                                <th style="border:1px solid #ddd; padding:0.5rem;">Action</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        if (record.students.length > 0) {
            record.students.forEach((student, index) => {
                cardHTML += `
                    <tr>
                        <td style="border:1px solid #ddd; padding:0.5rem;">
                            <input type="text" name="studentName" value="${student.name || ''}" data-index="${index}">
                        </td>
                        <td style="border:1px solid #ddd; padding:0.5rem;">
                            <input type="text" name="studentID" value="${student.id || ''}" data-index="${index}">
                        </td>
                        <td style="border:1px solid #ddd; padding:0.5rem;">
                            <input type="text" name="finalGrade" value="${student.grade || ''}" data-index="${index}">
                        </td>
                        <td style="border:1px solid #ddd; padding:0.5rem;">
                            <button type="button" class="remove-row-btn" data-index="${index}">Remove</button>
                        </td>
                    </tr>
                `;
            });
        } else {
            cardHTML += `
                    <tr>
                        <td style="border:1px solid #ddd; padding:0.5rem;">
                            <input type="text" name="studentName" value="" data-index="0">
                        </td>
                        <td style="border:1px solid #ddd; padding:0.5rem;">
                            <input type="text" name="studentID" value="" data-index="0">
                        </td>
                        <td style="border:1px solid #ddd; padding:0.5rem;">
                            <input type="text" name="finalGrade" value="" data-index="0">
                        </td>
                        <td style="border:1px solid #ddd; padding:0.5rem;">
                            <button type="button" class="remove-row-btn" data-index="0">Remove</button>
                        </td>
                    </tr>
            `;
        }
        cardHTML += `
                        </tbody>
                    </table>
                    <button type="button" class="add-row-btn" style="margin-top:0.5rem;">Add Student</button>
                    <button type="submit" style="margin-top:0.5rem;">Submit Grades</button>
                </form>
            </div>
        `;
        
        // Create a temporary container and set its innerHTML to cardHTML, then append its first child to the fragment
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = cardHTML;
        fragment.appendChild(tempDiv.firstElementChild);
    });
    
    // Clear the section and append all class cards at once
    classesSection.innerHTML = "";
    classesSection.appendChild(fragment);
    
    // Attach event listeners for each grade form and add/remove row buttons
    const gradeForms = document.querySelectorAll(".grade-form");
    gradeForms.forEach(form => {
        form.addEventListener("submit", submitGrades);
        const addRowBtn = form.querySelector(".add-row-btn");
        addRowBtn.addEventListener("click", function(e) { addRow(e, form); });
        const removeBtns = form.querySelectorAll(".remove-row-btn");
        removeBtns.forEach(btn => {
            btn.addEventListener("click", function(e) { removeRow(e, form); });
        });
    });
}


function addRow(e, form) {
    e.preventDefault();
    const tbody = form.querySelector("tbody");
    const rows = tbody.querySelectorAll("tr");
    let newIndex = rows.length;
    let newRowHTML = `
        <tr>
            <td style="border:1px solid #ddd; padding:0.5rem;">
                <input type="text" name="studentName" value="" data-index="${newIndex}">
            </td>
            <td style="border:1px solid #ddd; padding:0.5rem;">
                <input type="text" name="studentID" value="" data-index="${newIndex}">
            </td>
            <td style="border:1px solid #ddd; padding:0.5rem;">
                <input type="text" name="finalGrade" value="" data-index="${newIndex}">
            </td>
            <td style="border:1px solid #ddd; padding:0.5rem;">
                <button type="button" class="remove-row-btn" data-index="${newIndex}">Remove</button>
            </td>
        </tr>
    `;
    tbody.insertAdjacentHTML("beforeend", newRowHTML);
    const newRemoveBtn = tbody.querySelector(`button.remove-row-btn[data-index="${newIndex}"]`);
    newRemoveBtn.addEventListener("click", function(e) { removeRow(e, form); });
}

function removeRow(e, form) {
    e.preventDefault();
    const btn = e.target;
    const row = btn.closest("tr");
    row.parentNode.removeChild(row);
}

function submitGrades(e) {
    e.preventDefault();
    const form = e.target;
    const classCard = form.closest(".class-card");
    const crn = classCard.getAttribute("data-crn");
    
    let record = registrationData.find(r => r.CRN == crn);
    if (!record) return;
    
    const rows = form.querySelectorAll("tbody tr");
    let newStudents = [];
    rows.forEach(row => {
        const studentName = row.querySelector("input[name='studentName']").value.trim();
        const studentID = row.querySelector("input[name='studentID']").value.trim();
        const finalGrade = row.querySelector("input[name='finalGrade']").value.trim();
        if (studentName || studentID || finalGrade) {
            newStudents.push({
                name: studentName,
                id: studentID,
                grade: finalGrade
            });
        }
    });
    record.students = newStudents;
    localStorage.setItem("registration", JSON.stringify(registrationData));
    alert("Grades submitted successfully for CRN " + crn);
}
