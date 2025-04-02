// read all JSONs from localStorage
const students = JSON.parse(localStorage.getItem("students"));
const registration = JSON.parse(localStorage.getItem("registration"));
const instructors = JSON.parse(localStorage.getItem("instructorsJSON"));
const courses = JSON.parse(localStorage.getItem("courses"));
const course = JSON.parse(localStorage.getItem("courseJSON")); // classes info (if any)

// Select DOM elements
const course_form = document.querySelector("#newCourseForm");
const course_name = document.querySelector("#courseName");
const course_category = document.querySelector("#courseCategory");
const course_hours = document.querySelector("#courseHours");
const course_status = document.querySelector("#courseStatus");
const courses_List = document.querySelector("#courses");

const class_form = document.querySelector("#newClassForm");
const class_course = document.querySelector("#classCourse");
const instructorName = document.querySelector("#instructorName");
const maxRegistrations = document.querySelector("#maxRegistrations");

// Initial read to render the courses table
read();

// Listen to events for course and class creation
course_form.addEventListener("submit", create_course);
class_form.addEventListener("submit", create_class);

// Event delegation for Validate/Cancel buttons on the courses table
courses_List.addEventListener("click", handleCourseAction);

// -------------------- FUNCTIONS -------------------- //

// Create a new course from the newCourseForm
function create_course(e) {
    e.preventDefault();
    // Get form values
    const name = course_name.value.trim();
    const category = course_category.value.trim();
    const hours = course_hours.value.trim();
    const statusVal = course_status.value; // "open" or "pending"

    // Generate a unique course code using current timestamp
    const course_code = "COURSE" + Date.now();

    // Create a new course object
    const newCourse = {
        course_code: course_code,
        course_name: name,
        credit_hour: hours,
        category: category,
        status: statusVal
    };

    // Add newCourse to the courses array and update localStorage
    courses.push(newCourse);
    localStorage.setItem("courses", JSON.stringify(courses));

    // Update the dropdown in the newClassForm with the new course
    let option = document.createElement("option");
    option.value = course_code;
    option.textContent = name;
    class_course.appendChild(option);

    // Clear the form fields
    course_name.value = "";
    course_category.value = "";
    course_hours.value = "";
    course_status.value = "open";

    console.log("New course created: " + name);
    // Optionally, you could call read() if the courses table needs to update based on courses.
}

// Create a new class (registration record) from the newClassForm
function create_class(e) {
    e.preventDefault();
    // Get form values
    const selectedCourse = class_course.value;
    const instructor = instructorName.value.trim();
    const maxRegs = parseInt(maxRegistrations.value);

    if (!selectedCourse) {
        console.log("Please select a course.");
        return;
    }

    // Generate a unique CRN using current timestamp
    const newCRN = Date.now();

    // Create a new registration record for the class
    const newClass = {
        CRN: newCRN,
        course_code: selectedCourse,
        instructor: instructor,
        seats: maxRegs,
        status: "pending" // default status for new classes
    };

    // Add the new class to the registration array and update localStorage
    registration.push(newClass);
    localStorage.setItem("registration", JSON.stringify(registration));

    // Clear the form fields
    class_course.value = "";
    instructorName.value = "";
    maxRegistrations.value = "";

    read(); // re-render the courses table
    console.log("New class created for course " + selectedCourse);
}

// Handle click events for Validate/Cancel buttons using event delegation
function handleCourseAction(e) {
    if (e.target.classList.contains("validate-btn")) {
        let crn = e.target.getAttribute("data-crn");
        validateClass(crn);
    }
    if (e.target.classList.contains("cancel-btn")) {
        let crn = e.target.getAttribute("data-crn");
        cancelClass(crn);
    }
}

// Validate a class (update its status to "validated")
function validateClass(crn) {
    let record = registration.find(rec => rec.CRN == crn);
    if (record) {
        record.status = "validated";
        localStorage.setItem("registration", JSON.stringify(registration));
        read();
    }
}

// Cancel a class (update its status to "cancelled")
function cancelClass(crn) {
    let record = registration.find(rec => rec.CRN == crn);
    if (record) {
        record.status = "cancelled";
        localStorage.setItem("registration", JSON.stringify(registration));
        read();
    }
}

// Count seats for a given class using its CRN
function countSeats(CRN) {
    const registerCourse = course.find(element => element.CRN == CRN);
    let count = registerCourse ? registerCourse.students.length : 0;
    return count;
}

// Read the registration array, update records with course info, group by course, and render
async function read() {
    let list = [];

    // Enhance each registration record with extra info from courses array and computed fields
    registration.forEach((e) => {
        // Compute actual registrations using countSeats (if applicable)
        let count = countSeats(e.CRN);
        e.actual_seats = count;
        // Get course details from the courses array
        let courseInfo = courses.find(el => el.course_code == e.course_code);
        if (courseInfo) {
            e.course_name = courseInfo.course_name;
            e.category = courseInfo.category;
            e.credit_hour = courseInfo.credit_hour;
        }
        list.push(e);
    });

    // Group registration records by course_code
    const grouped = groupByCourse(list);
    renderGroupedCourses(grouped);
}

// Group registration records (classes) by course_code
function groupByCourse(list) {
    let groups = {};
    list.forEach(record => {
        // Exclude cancelled records from grouping
        if (record.status !== "cancelled") {
            if (!groups[record.course_code]) {
                groups[record.course_code] = [];
            }
            groups[record.course_code].push(record);
        }
    });
    return groups;
}

// Render the grouped courses in the table
function renderGroupedCourses(grouped) {
    let html = "";
    // Iterate over each group (course)
    for (let course_code in grouped) {
        let records = grouped[course_code];
        // Get course info from the first record in the group
        let courseName = records[0].course_name || "";
        let category = records[0].category || "";

        // Determine overall status for the course
        let overallStatus = "Pending";
        if (records.some(r => r.status === "validated")) {
            overallStatus = "Validated";
        } else if (records.every(r => r.status === "open")) {
            overallStatus = "Open for Registration";
        }

        // Build the list of class details for this course
        let classList = records.map(r => `
            <li>
                CRN: ${r.CRN} - Instructor: ${r.instructor} (${r.actual_seats}/${r.seats} regs) - Status: ${r.status}
            </li>
        `).join("");

        // Build the list of action buttons for each class
        let actionList = records.map(r => `
            <li>
                <button class="btn validate-btn" data-crn="${r.CRN}">Validate</button>
                <button class="btn cancel-btn" data-crn="${r.CRN}">Cancel</button>
            </li>
        `).join("");

        // Render one row per course
        html += `
            <tr>
                <td>${courseName}</td>
                <td>${category}</td>
                <td>${overallStatus}</td>
                <!-- Classes Column -->
                <td>
                    <ul style="margin:0; padding-left: 20px;">
                        ${classList}
                    </ul>
                </td>
                <!-- Actions Column -->
                <td>
                    <ul style="margin:0; padding-left: 20px;">
                        ${actionList}
                    </ul>
                </td>
            </tr>
        `;
    }
    courses_List.innerHTML = html;
}
