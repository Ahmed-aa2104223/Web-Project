// retrieve student info
const email = localStorage.getItem("email");


// selectors
const courses = document.querySelector("#courses");
const search = document.querySelector("#search");
const searchButton = document.querySelector("#searching");
const btnName = document.querySelector("#btnName");
const btnCategory = document.querySelector("#btnCategory");
const insertion = document.querySelector("#insertion");


//event listeners
searchButton.addEventListener("submit",searching)

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
    
    const response2 = await fetch('../data/courses.json');
    const data2 = await response2.json();

    insertion.innerhtml = "";
    
    filtered.courses.forEach((e) => {
        courseInfo = data2.find((element) => element.course_code === e.course_code);
        courseInfo.status = e.status;
        courseInfo.grade = e.grade;
        insertion.innerHTML += renderInfo(courseInfo);
    });


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
    filtered.forEach(element => {
        courses.innerHTML += renderCourses(element);
    });
}


// reading and rendering

async function read(){
    const response = await fetch('../data/courses.json');
    const data = await response.json();
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
                    <p>No prerequiste needed</p>
                </div>`;
    }
}