const courses = document.querySelector("#courses");
const search = document.querySelector("#search");
const searchButton = document.querySelector("#searching");

// searchButton.addEventListener("submit",searching)

searching();

async function searching(){
    // e.preventDefault();
    const response = await fetch('../data/courses.json');
    const data = await response.json();
    filtered = data.filter( (element) => element.course_name.includes("Pro"));
    
    
    
    
    
}




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