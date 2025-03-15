


// retrieve student info
const email = localStorage.getItem("email");
const studentCourses = JSON.parse(localStorage.getItem("studentCourses"));
const allCourses = JSON.parse(localStorage.getItem("allCourses"));
const registration = JSON.parse(localStorage.getItem("registration"));
const students = JSON.parse(localStorage.getItem("students"))
const course = JSON.parse(localStorage.getItem("courseJSON"))


// selectors
const course_list = document.querySelector("#course_list");

course_list.addEventListener("submit",register);


read()

// registration
async function register(e){
    dupe = dups(e);
    seat = registration.find(element => element.CRN == e).seats
    let myPromise = isQualified(e);
    myPromise.then((value) =>{
        dupe.then((ans) =>{
            if(value){
                if(ans){
                    alert("Dupe")
                }else if (!ans && countSeats(e)<seat){
                    const studentID = students.find(student => student.email == email);
                    let newCourse = {
                        "course_code" : registration.find(element => element.CRN == e).course_code,
                        "grade" : "N/A",
                        "status" : "Pending"
                    }
                    length = studentID.courses.length;
                    studentID.courses[length] = newCourse;
                    localStorage.setItem("students", JSON.stringify(students));
                    localStorage.setItem("studentCourses", JSON.stringify(studentID.courses));
                    
                    
                    const registerCourse = course.find( element => element.CRN == e);
                    let newStudent = {
                        "id" : studentID.id,
                        "grade" : "N/A"
                    }
                    lengthC = registerCourse.students.length;
                    registerCourse.students[lengthC] = newStudent;
                    localStorage.setItem("courseJSON", JSON.stringify(course))
                    
                    course_list.innerHTML = "";
                    read();
                    window.location = window.location.href;
                    alert("You have successfully registered!")
                }else{
                    alert("No seats available")
                }
            } else{
                alert("You are not qualified")
            }
            
        })
        
    })
}


// check dups
async function dups(CRN){
    course_code = registration.find((element) => element.CRN == CRN).course_code;
    if(studentCourses.find(element => element.course_code == course_code)){
        return true;
    }else{
        return false;
    }
}


// check whether the student is qualifed to register for the course

async function isQualified(CRN){
    course_code = registration.find((element) => element.CRN == CRN).course_code;
    preq = allCourses.find((element) => element.course_code == course_code).prerequisite;
    conpreq = allCourses.find((element) => element.course_code == course_code).concurrent_prerequisite;
    courseStatus = registration.find((element) => element.CRN == CRN).status;    

    if(courseStatus == "open"){
        if(preq == null && conpreq){
            if(studentCourses.find((element) => element.course_code == conpreq))
                return true; 
            }          
        else if(preq == null)
            return true;
        else if(preq.includes("")){
            if(course_code != "CMPS 493"){
                if(studentCourses.find((element) => element.course_code == preq))
                    return true; 
            } else{
                preq1 = ["CMPS 310","CMPS 350"];
                preq2 = ["CMPS 310","CMPS 405"];
                preqCourse = [];
                studentCourses.forEach(element => {
                    preqCourse.push(element.course_code);
                });
                if(preq1.filter(c => preqCourse.includes(c)).length == 2 || preq2.filter(c => preqCourse.includes(c)).length == 2){
                    return true;
                }
            }
        }
        else{
            length = preq.length;
            preqCourse = [];
            studentCourses.forEach(element => {
                preqCourse.push(element.course_code);
            });
            if(preq.filter(c => preqCourse.includes(c)).length == length)
                return true;
            }
    } else {
        return false;
    }
    return false;
}

// count seats
function countSeats(CRN) {
    const registerCourse = course.find( element => element.CRN == CRN);
    count = registerCourse.students.length;
    return count;
    
}


// save the registration details

async function read() {
    localStorage.setItem("students", JSON.stringify(students));

    registration.forEach((e) =>{
        count = countSeats(e.CRN);
        e.course_name = allCourses.find((element) => element.course_code == e.course_code).course_name;
        e.credit_hour = allCourses.find((element) => element.course_code == e.course_code).credit_hour;
        e.actual_seats = e.seats - count;
        course_list.innerHTML += renderCourses(e);
    })
    

}

// render the courses

function renderCourses(data){
    if(!data.course_name == ""){
        return `<tr value="${data.status}" id="${data.CRN}">
                    <td class="course_name">${data.course_name}</td>
                    <td class="course_code">${data.course_code}</td>
                    <td class="credit_hour">${data.credit_hour}</td>
                    <td class="instructor">${data.instructor}</td>
                    <td class="seats">${data.actual_seats}/${data.seats}</td>
                    <td class="CRN">${data.CRN}</td>
                    <td>
                        <form>
                            <input type="submit" value="Register" onClick="event.preventDefault();register(${data.CRN})">
                        </form>
                    </td>
                </tr>`;
    }
}
