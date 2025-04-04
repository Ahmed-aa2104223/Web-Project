// read all JSONs from localStorage
const students = JSON.parse(localStorage.getItem("students"));
const registration = JSON.parse(localStorage.getItem("registration"));
const instructors = JSON.parse(localStorage.getItem("instructorsJSON"));
const courses = JSON.parse(localStorage.getItem("courses"));
const course = JSON.parse(localStorage.getItem("courseJSON")); // classes info (if any)

console.log(students);


// Global filter variables; default is "all"
let selectedCategory = "all";
let selectedStatus = "all";

// Select DOM elements
const course_form = document.querySelector("#newCourseForm");
const course_name = document.querySelector("#courseName");
const course_code = document.querySelector("#courseCode");
const course_hours = document.querySelector("#courseHours");
const prerequisite = document.querySelector("#prerequisite");
const concurrentPrerequisite = document.querySelector("#concurrentPrerequisite");
const course_category = document.querySelector("#courseCategory");
const course_status = document.querySelector("#courseStatus");
const courses_List = document.querySelector("#courses");

const class_form = document.querySelector("#newClassForm");
const courseCodeInput = document.querySelector("#courseCodeInput"); // text input for course code
const crnInput = document.querySelector("#crnInput"); // text input for CRN
const instructorName = document.querySelector("#instructorName");
const maxRegistrations = document.querySelector("#maxRegistrations");

// Listen for changes in the category filter
const categoryFilter = document.querySelector("#categoryFilter");
if (categoryFilter) {
    categoryFilter.addEventListener("change", function(e) {
        selectedCategory = e.target.value;
        read();
    });
}

// Listen for changes in the status filter
const statusFilter = document.querySelector("#statusFilter");
if (statusFilter) {
    statusFilter.addEventListener("change", function(e) {
        selectedStatus = e.target.value;
        read();
    });
}

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
    const code = course_code.value.trim();
    const hours = course_hours.value.trim();
    const preq = prerequisite.value.trim() || null;
    const concPreq = concurrentPrerequisite.value.trim() || null;
    const category = course_category.value.trim();
    const statusVal = course_status.value; // "open" or "pending"

    // Create a new course object
    const newCourse = {
        course_name: name,
        course_code: code,
        credit_hour: hours,
        prerequisite: preq,
        concurrent_prerequisite: concPreq,
        category: category,
        status: statusVal
    };

    // Add newCourse to the courses array and update localStorage
    courses.push(newCourse);
    localStorage.setItem("courses", JSON.stringify(courses));

    // Clear the form fields
    course_name.value = "";
    course_code.value = "";
    course_hours.value = "";
    prerequisite.value = "";
    concurrentPrerequisite.value = "";
    course_category.value = "";
    course_status.value = "open";

    console.log("New course created: " + name);
    // Optionally, call read() if the courses table should update
}

// Create a new class (registration record) from the newClassForm
function create_class(e) {
    e.preventDefault();
    // Get form values from text inputs
    const code = courseCodeInput.value.trim();
    const crn = crnInput.value.trim();
    const instructor = instructorName.value.trim();
    const maxRegs = parseInt(maxRegistrations.value);

    if (!code || !crn) {
        console.log("Please enter both course code and CRN.");
        return;
    }

    // Create a new registration record for the class
    const newClass = {
        CRN: crn, // use the entered CRN
        course_code: code,
        instructor: instructor,
        seats: maxRegs,
        status: "pending" // default status for new classes
    };

    // Add the new class to the registration array and update localStorage
    registration.push(newClass);
    localStorage.setItem("registration", JSON.stringify(registration));

    // Clear the form fields
    courseCodeInput.value = "";
    crnInput.value = "";
    instructorName.value = "";
    maxRegistrations.value = "";

    read(); // re-render the courses table
    console.log("New class created for course " + code);
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


function getStudent(crn, status){
    let instructor = course.find(element => element.CRN = crn);
    if(instructor != undefined){
        instructor.students.forEach( element => {
            student = students.find( e => e.id = element.id)
            courseStudent = student.courses.find(element => element.CRN === crn);
            courseStudent.status = status  
        })
    }
    
}

// Validate a class (update its status to "validated")
function validateClass(crn) {
    let record = registration.find(rec => rec.CRN == crn);
    if (record) {
        record.status = "validated";
        localStorage.setItem("registration", JSON.stringify(registration));
        getStudent(record.CRN, "In-progress")
        localStorage.setItem("students", JSON.stringify(students))
        read();
    }
}

// Cancel a class (update its status to "cancelled")
function cancelClass(crn) {
    let record = registration.find(rec => rec.CRN == crn);
    if (record) {
        record.status = "cancelled";
        localStorage.setItem("registration", JSON.stringify(registration));
        getStudent(record.CRN, "Cancelled")
        localStorage.setItem("students", JSON.stringify(students))
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
    let grouped = groupByCourse(list);

    // Apply category filter if a category is selected (other than "all")
    if (selectedCategory && selectedCategory.toLowerCase() !== "all") {
        for (let key in grouped) {
            if (grouped[key].length > 0 && grouped[key][0].category.toLowerCase() !== selectedCategory.toLowerCase()) {
                delete grouped[key];
            }
        }
    }

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
    // Iterate over each course group
    for (let course_code in grouped) {
        let records = grouped[course_code];
        // Filter records based on the selected status (if not "all")
        let filteredRecords = (selectedStatus.toLowerCase() === "all") 
            ? records 
            : records.filter(r => r.status.toLowerCase() === selectedStatus.toLowerCase());
        // If no class in this course matches the status filter, skip it
        if (filteredRecords.length === 0) continue;
        
        // Get course info from the first record (same for all in the group)
        let courseName = records[0].course_name || "";
        let category = records[0].category || "";
        
        // Determine overall status:
        // If filtering by status, use that filter value;
        // otherwise, compute overall status from all records in the group.
        let overallStatus;
        if (selectedStatus.toLowerCase() !== "all") {
            overallStatus = selectedStatus;
        } else {
            if (records.some(r => r.status.toLowerCase() === "validated")) {
                overallStatus = "Validated";
            } else if (records.every(r => r.status.toLowerCase() === "open")) {
                overallStatus = "Open for Registration";
            } else {
                overallStatus = "Pending";
            }
        }
        
        // Build lists using only the filtered records
        let classList = filteredRecords.map(r => `
            <li>
                CRN: ${r.CRN} - Instructor: ${r.instructor} (${r.actual_seats}/${r.seats} regs) - Status: ${r.status}
            </li>
        `).join("");
        
        let actionList = filteredRecords.map(r => `
            <li>
                <button class="btn validate-btn" data-crn="${r.CRN}">Validate</button>
                <button class="btn cancel-btn" data-crn="${r.CRN}">Cancel</button>
            </li>
        `).join("");
        
        // Render one row per course group with only the filtered classes
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

