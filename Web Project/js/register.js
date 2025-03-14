

// retrieve student info
const email = localStorage.getItem("email");
const courses = JSON.parse(localStorage.getItem("courses"));
const allCourses = JSON.parse(localStorage.getItem("allCourses"));
const registration = JSON.parse(localStorage.getItem("registration"));

// selectors
const course_list = document.querySelector("#course_list");

read()

// check whether the student is qualifed to register for the course

async function isQualified(CRN){
    course_code = registration.find((element) => element.CRN == CRN).course_code;
    preq = allCourses.find((element) => element.course_code == course_code).prerequisite;
    conpreq = allCourses.find((element) => element.course_code == course_code).concurrent_prerequisite;
    courseStatus = registration.find((element) => element.CRN == CRN).status;    

    if(courseStatus == "open"){
        if(preq == null && conpreq){
            if(courses.find((element) => element.course_code == conpreq))
                return true; 
            }          
        else if(preq == null)
            return true;
        else if(preq.includes("")){
            if(course_code != "CMPS 493"){
                if(courses.find((element) => element.course_code == preq))
                    return true; 
            } else{
                preq1 = ["CMPS 310","CMPS 350"];
                preq2 = ["CMPS 310","CMPS 405"];
                preqCourse = [];
                courses.forEach(element => {
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
            courses.forEach(element => {
                preqCourse.push(element.course_code);
            });
            if(preq.filter(c => preqCourse.includes(c)).length == length)
                return true;
            }
        return false;
    } else {
        return false;
    }
}

// save the registration details

async function read() {
    const response2 = await fetch('../data/registration.json');
    const registration = await response2.json();
    localStorage.setItem("registration",JSON.stringify(registration));
    
    registration.forEach((e) =>{
        e.course_name = allCourses.find((element) => element.course_code == e.course_code).course_name;
        e.credit_hour = allCourses.find((element) => element.course_code == e.course_code).credit_hour;
        course_list.innerHTML += renderCourses(e);
    })
    

}


function renderCourses(data){
    if(!data.course_name == ""){
        return `<tr value="${data.status}">
                    <td>${data.course_name}</td>
                    <td>${data.course_code}</td>
                    <td>${data.credit_hour}</td>
                    <td>${data.instructor}</td>
                    <td>${data.seats}</td>
                    <td>${data.CRN}</td>
                    <td>
                        <form>
                            <input type="submit" value="Register">
                        </form>
                    </td>
                </tr>`;
    }
}


// later
// document.querySelectorAll("tbody tr").forEach(row => {
//     row.querySelector("input[type='submit']").addEventListener("click", function(event) {
//         event.preventDefault(); // Prevent form submission

//         let cells = row.querySelectorAll("td");
//         let courseData = {
//             courseName: cells[0].innerText,
//             courseCode: cells[1].innerText,
//             creditHour: cells[2].innerText,
//             instructor: cells[3].innerText,
//             seats: cells[4].innerText,
//             crn: cells[5].innerText
//         };

//         console.log("Selected Course:", courseData);
//     });
// });
