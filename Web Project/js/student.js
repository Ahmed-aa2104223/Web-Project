const courses = document.querySelector("#courses");
const search = document.querySelector("#search");
const searchButton = document.querySelector("#searching");
const btnName = document.querySelector("#btnName");
const btnCategory = document.querySelector("#btnCategory");



searchButton.addEventListener("submit",searching)

read();


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