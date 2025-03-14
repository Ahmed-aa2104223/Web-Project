read()




// retrieve student info
const email = localStorage.getItem("email");
const courses = JSON.parse(localStorage.getItem("courses"));
const allCourses = JSON.parse(localStorage.getItem("allCourses"));
const registration = JSON.parse(localStorage.getItem("registration"));
const students = JSON.parse(localStorage.getItem("students"))

// selectors
const course_list = document.querySelector("#course_list");

course_list.addEventListener("submit",register);

// registration
async function register(e){
    dupe = dups(e);
    let myPromise = isQualified(e);
    myPromise.then((value) =>{
        dupe.then((ans) =>{
            if(value){
                if(ans){
                    alert("dupe")
                }else{
                    const studentID = students.find(student => student.email == email);
                    newCourse = {
                        "course_code" : registration.find(element => element.CRN == e).course_code,
                        "grade" : "N/A",
                        "status" : "Pending"
                    }
                    length = studentID.courses.length;
                    studentID.courses[length] = newCourse;
                    localStorage.setItem("students", JSON.stringify(students));
                    alert("qualified")
                    console.log(students);
                    
                }
            } else{
                
                alert("you are not qualified")
            }
            
        })
        
    })
}


// check dups
async function dups(CRN){
    course_code = registration.find((element) => element.CRN == CRN).course_code;
    if(courses.find(element => element.course_code == course_code)){
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
    } else {
        return false;
    }
    return false;
}

// save the registration details

async function read() {
    const response2 = await fetch('../data/registration.json');
    const registration = await response2.json();
    localStorage.setItem("registration",JSON.stringify(registration));
    localStorage.setItem("students", JSON.stringify(students));

    registration.forEach((e) =>{
        e.course_name = allCourses.find((element) => element.course_code == e.course_code).course_name;
        e.credit_hour = allCourses.find((element) => element.course_code == e.course_code).credit_hour;
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
                    <td class="seats">${data.seats}</td>
                    <td class="CRN">${data.CRN}</td>
                    <td>
                        <form>
                            <input type="submit" value="Register" onClick="event.preventDefault();register(${data.CRN})">
                        </form>
                    </td>
                </tr>`;
    }
}
