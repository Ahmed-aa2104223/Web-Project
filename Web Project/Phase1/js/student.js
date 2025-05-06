window.onload = JSON.parse(localStorage.getItem("students"));



// retrieve student info
const email = localStorage.getItem("email");
const students = JSON.parse(localStorage.getItem("students"))
const allCourses = JSON.parse(localStorage.getItem("courses"))
// selectors
const courses = document.querySelector("#courses");
const search = document.querySelector("#search");
const searchButton = document.querySelector("#searching");
const btnName = document.querySelector("#btnName");
const btnCategory = document.querySelector("#btnCategory");
const insertion = document.querySelector("#insertion");
const studentinfo = document.querySelector("#name");
const Gbuttom = document.querySelector("#GButtom");
const Ybuttom = document.querySelector("#YButtom");
const Rbuttom = document.querySelector("#RButtom");
const Wbuttom = document.querySelector("#WButtom");


const allCourses_buttom = document.querySelector("#allcoursesbuttom");
const learn_path_buttom = document.querySelector("#learning_path");
const course_continer = document.querySelector("#courses_contanier");
const learn_path = document.querySelector("#learnpath");





// const registerlink = document.querySelector("#registerlink");



// functions
read();
retrieve();
//
allCourses_buttom.addEventListener("click", function(e){
    e.preventDefault();
    learn_path.style.display = "none";
    course_continer.style.display = "contents"
})
learn_path_buttom.addEventListener("click", function(e){
    e.preventDefault();
    course_continer.style.display = "none";
    learn_path.style.display = "contents"
})


//Filter Buttoms
Gbuttom.addEventListener("click", async function(e){
    e.preventDefault();
    Gbuttom.style.width = "50px"
    Ybuttom.style.width = "35px"
    Rbuttom.style.width = "35px"
    Gbuttom.style.backgroundColor = "var(--Green)"
    Ybuttom.style.backgroundColor = "#a2aa00";
    Rbuttom.style.backgroundColor = "#4d0000";
    Wbuttom.style.backgroundColor = "#494949"
    retrieveColor("Completed");

})
Ybuttom.addEventListener("click", async function(e){
    e.preventDefault();
    Ybuttom.style.width = "50px"
    Gbuttom.style.width = "35px"
    Rbuttom.style.width = "35px"
    Ybuttom.style.backgroundColor = "var(--Yellow)"
    Gbuttom.style.backgroundColor = "#003d00";
    Rbuttom.style.backgroundColor = "#4d0000";
    Wbuttom.style.backgroundColor = "#494949"
    retrieveColor("In-progress");
})
Rbuttom.addEventListener("click", async function(e){
    e.preventDefault();
    Rbuttom.style.width = "50px"
    Gbuttom.style.width = "35px"
    Ybuttom.style.width = "35px"
    Rbuttom.style.backgroundColor = "var(--Red)"
    Gbuttom.style.backgroundColor = "#003d00";
    Ybuttom.style.backgroundColor = "#a2aa00";
    Wbuttom.style.backgroundColor = "#494949"
    retrieveColor("Pending");
});
Wbuttom.addEventListener("click", async function(e){
    e.preventDefault();
    Rbuttom.style.width = "35px"
    Gbuttom.style.width = "35px"
    Ybuttom.style.width = "35px"
    Wbuttom.style.backgroundColor = "#ffffff21"
    Rbuttom.style.backgroundColor = "#bc0000"
    Gbuttom.style.backgroundColor = "#008000";
    Ybuttom.style.backgroundColor = "#cbd600";
    filtered = students.find((element) => element.email.toLowerCase() === email);
    const response2 = await fetch('../data/courses.json');
    const data2 = await response2.json();
    insertion.innerHTML = ""
    filtered.courses.forEach((e) => {
        courseInfo = data2.find((element) => element.course_code === e.course_code);
        courseInfo.status = e.status;
        courseInfo.grade = e.grade;
        insertion.innerHTML += renderInfo(courseInfo);
    });
});

// BUTTONS
// btnName.addEventListener("click", function(e){
//     e.preventDefault();
//     btnName.value = "active"
//     btnCategory.value = ""
// })

// btnCategory.addEventListener("click", function(e){
//     e.preventDefault();
//     btnName.value = ""
//     btnCategory.value = "active"
// })

async function retrieveColor(Color){ 
    filtered = students.find((element) => element.email.toLowerCase() === email);
    insertion.innerHTML = ""
    filtered.courses.forEach((e) => {
        courseInfo = allCourses.find((element) => element.course_code === e.course_code);
        courseInfo.status = e.status;
        courseInfo.grade = e.grade;
        if(courseInfo.status == Color)
        insertion.innerHTML += renderInfo(courseInfo);
    });
 }





// retrieving student info
async function retrieve(){  
    filtered = students.find((element) => element.email.toLowerCase() === email);
    
    localStorage.setItem("studentCourses",JSON.stringify(filtered.courses));
    let gpaCourses = [];
    insertion.innerhtml = "";

    

    filtered.courses.forEach((e) => {
        courseInfo = allCourses.find((element) => element.course_code === e.course_code);
        courseInfo.status = e.status;
        courseInfo.grade = e.grade;
        gpaCourses.push(courseInfo);
        insertion.innerHTML += renderInfo(courseInfo);
    });

    gpa = calculateGPA(gpaCourses);
    console.log(gpa);
    

    studentinfo.innerHTML = `<h2>WELCOME &nbsp;&nbsp;&nbsp;&nbsp; ${filtered.name}!</h2> 
                            <h2>GPA: ${gpa}</h2>`
}

// rendering the student information
function renderInfo(course){
    let colourFinder;
    let value;
    if(!course.course_name == ""){
        if(course.status == "Completed")
            colourFinder = "var(--Green)";
        if (course.status == "In-progress")
            colourFinder = "var(--Yellow)";
        if (course.status == "Pending") 
            colourFinder = "var(--Red)";
        if (course.status == "Cancelled") 
            value = "black";
        

        return ` <div class="card-course" value=${value}>
                <h3>${course.course_code}</h1>
                <h4 class="card-course-name">${course.course_name}</h4>
                <h4>${course.credit_hour} CREDITS</h4>
                <h4>${course.status}</h4>
                <h4 style="color: ${colourFinder};" class="grade-course" >${course.grade}</h4>
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
            console.log(course);
            
            
            
            totalPoints += gradeScale[course.grade] * course.credit_hour;
            totalCredits += course.credit_hour;
        }
    });

    console.log(totalPoints);
    console.log(totalCredits);

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "N/A";
}












//------------------------All courses-----------------------------
// reading and rendering
async function read(){
    allCourses.map((element) => {
        if(element.prerequisite == null && element.concurrent_prerequisite)
            element.prerequisite = `Prerequisite: ${element.concurrent_prerequisite} (can be taken concurrently) `
        else if(element.prerequisite == null )
            element.prerequisite = "No prerequisite is needed"
        else if(element.prerequisite.includes(""))
            element.prerequisite = `Prerequisite: ${element.prerequisite}`
        else
            element.prerequisite = `Prerequisite: ${element.prerequisite.join(" and ")}`;
    })
    allCourses.forEach(element => {
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

// searching
// searching
search.onkeyup = async function(e){
    e.preventDefault();
    const value = search.value.toLowerCase();
    // Filter courses by name, course code
    let filtered = allCourses.filter(element => 
        element.course_name.toLowerCase().includes(value) ||
        element.course_code.toLowerCase().includes(value) 
    );

    courses.innerHTML = "";

    filtered.forEach(element => {
        courses.innerHTML += renderCourses(element);
    });

    
}



/*didn't want to alter the above the code in case we needed it as is,
but this essentially makes sure that we show all courses offered by default*/
document.addEventListener("DOMContentLoaded", function(){
    course_continer.style.display = "contents"; 
    learn_path.style.display = "none";
});
