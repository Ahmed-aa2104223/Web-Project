// retrieve student info
const email = localStorage.getItem("email");

// selectors
const courses = document.querySelector("#courses");
const search = document.querySelector("#search");
const searchButton = document.querySelector("#searching");
const btnName = document.querySelector("#btnName");
const btnCategory = document.querySelector("#btnCategory");
const insertion = document.querySelector("#insertion");
const studentinfo = document.querySelector("#name");
// const registerlink = document.querySelector("#registerlink");

//event listeners
searchButton.addEventListener("submit",searching)
// registerlink.addEventListener("click",send)


// functions
read();
retrieve();


// BUTTONS
btnName.addEventListener("click", function(e){
    e.preventDefault();
    btnName.value = "active"
    btnCategory.value = ""
})

btnCategory.addEventListener("click", function(e){
    e.preventDefault();
    btnName.value = ""
    btnCategory.value = "active"
})

// retrieving student info
async function retrieve(){  
    const response = await fetch('../data/students.json');
    const data = await response.json();
    filtered = data.find((element) => element.email.toLowerCase() === email);
    
    localStorage.setItem("courses",JSON.stringify(filtered.courses));
    
    const response2 = await fetch('../data/courses.json');
    const data2 = await response2.json();
    
    let gpaCourses = [];
    insertion.innerhtml = "";
    
    filtered.courses.forEach((e) => {
        courseInfo = data2.find((element) => element.course_code === e.course_code);
        courseInfo.status = e.status;
        courseInfo.grade = e.grade;
        gpaCourses.push(courseInfo);
        insertion.innerHTML += renderInfo(courseInfo);
    });

    gpa = calculateGPA(gpaCourses);

    studentinfo.innerHTML = `<h2>WELCOME &nbsp;&nbsp;&nbsp;&nbsp; ${filtered.name}!</h2> 
                            <h2>GPA: ${gpa}</h2>`
}

// rendering the student information
function renderInfo(course){
    if(!course.course_name == ""){
        return ` <div class="card-course">
                <h3>${course.course_code}</h1>
                <h4 class="card-course-name">${course.course_name}</h4>
                <h4>${course.credit_hour} CREDITS</h4>
                <h4>${course.status}</h4>
                <h4 class="grade-course">${course.grade}</h4>
            </div>`;
    }
}

// calculate the GPA

function calculateGPA(courses) {
    const gradeScale = {
        "A": 4.0, "B+": 3.5, "B": 3.0,"C+": 2.5,    
        "C": 2.0, "D+": 1.5, "D": 1.0, "F": 0.0
    };

    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        if (course.status === "Completed" && gradeScale[course.grade] !== undefined) {
            totalPoints += gradeScale[course.grade] * course.credit_hour;
            totalCredits += course.credit_hour;
        }
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "N/A";
}

// searching

async function searching(e){
    e.preventDefault();
    const response = await fetch('../data/courses.json');
    const data = await response.json();
    value = search.value.toLowerCase();
    if(btnName.value === "active")
        filtered = data.filter( (element) => element.course_name.toLowerCase().includes(value));
    if(btnCategory.value === "active")
        filtered = data.filter( (element) => element.course_code.toLowerCase().includes(value));

    courses.innerHTML = "";
    
    filtered.map((element) => {
        if(element.prerequisite == null && element.concurrent_prerequisite)
            element.prerequisite = `Prerequisite: ${element.concurrent_prerequisite} (can be taken concurrently) `
        else if(element.prerequisite == null )
            element.prerequisite = "No prerequisite is needed"
        else if(element.prerequisite.includes(""))
            element.prerequisite = `Prerequisite: ${element.prerequisite}`
        else
            element.prerequisite = `Prerequisite: ${element.prerequisite.join(" and ")}`;
    })

    filtered.forEach(element => {
        courses.innerHTML += renderCourses(element);
    });
}


// reading and rendering

async function read(){
    const response = await fetch('../data/courses.json');
    const data = await response.json();
    localStorage.setItem("allCourses", JSON.stringify(data));
    data.map((element) => {
        if(element.prerequisite == null && element.concurrent_prerequisite)
            element.prerequisite = `Prerequisite: ${element.concurrent_prerequisite} (can be taken concurrently) `
        else if(element.prerequisite == null )
            element.prerequisite = "No prerequisite is needed"
        else if(element.prerequisite.includes(""))
            element.prerequisite = `Prerequisite: ${element.prerequisite}`
        else
            element.prerequisite = `Prerequisite: ${element.prerequisite.join(" and ")}`;
    })
    data.forEach(element => {
        courses.innerHTML += renderCourses(element);
    });

}

function renderCourses(data){
    if(!data.course_name == ""){
        return ` <div class="card">
                    <h2>${data.course_code}</h2>
                    <p>${data.course_name}</p>
                    <p>${data.credit_hour} credits</p>
                    <p>${data.prerequisite}</p>
                </div>`;
    }
}