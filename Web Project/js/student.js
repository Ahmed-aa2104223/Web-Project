const courses = document.querySelector("#courses");





read();

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