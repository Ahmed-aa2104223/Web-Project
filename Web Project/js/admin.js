// read all jsons
const students = JSON.parse(localStorage.getItem("students"))
const registration = JSON.parse(localStorage.getItem("registration"))
const instructors = JSON.parse(localStorage.getItem("instructorsJSON"))
const courses = JSON.parse(localStorage.getItem("courses"))
const course = JSON.parse(localStorage.getItem("courseJSON"))

// select documents
const course_form = document.querySelector("#newCourseForm");
const course_name = document.querySelector("#courseName");
const course_category = document.querySelector("#courseCategory");
const course_hours = document.querySelector("#courseHours");
const course_status = document.querySelector("#courseStatus");

read()


// listen to events
course_form.addEventListener("submit", create_course);


function create_course(e){
    e.preventDefault();
    console.log(course_status.value);
}



// count seats
function countSeats(CRN) {
    const registerCourse = course.find( element => element.CRN == CRN);
    count = registerCourse.students.length;
    return count;
    
}


// read the files and render them
async function read() {

    list = []

    registration.forEach((e) =>{
        count = countSeats(e.CRN);
        e.course_name = courses.find((element) => element.course_code == e.course_code).course_name;
        e.credit_hour = courses.find((element) => element.course_code == e.course_code).credit_hour;
        e.actual_seats = count;

        list.push(e);
        
    })
    
    console.log(list);

    

}



// render the courses
function renderCourses(data){
    if(!data.course_name == ""){
        return `<tr>
            <td>${data.course_name}</td>
            <td>${data.course_code}</td>
            <td>${ (data.course_name == 'open') ? "Open for Registration" : "Pending"}</td>
            <td>
              <ul style="margin:0; padding-left: 20px;">
                <li>${data.CRN} - Instructor: $ (10/30 regs)</li>
                <li>Class B - Instructor: Zeyad (5/30 regs)</li>
              </ul>
            </td>
            <td>
              <button class="btn">Validate</button>
              <button class="btn">Cancel</button>
            </td>
          </tr>`;
    }
}