window.onload = JSON.parse(localStorage.getItem("instructorsJSON"));



// retrieve student info
const email = localStorage.getItem("email");
const instructor = JSON.parse(localStorage.getItem("instructorsJSON"))

// selectors
const courses = document.querySelector("#courses");
const instructorinfo = document.querySelector("#nameinstructor");

retrieve();

// retrieving student info
async function retrieve(){  
    filtered = instructor.find((element) => element.email.toLowerCase() === email);
    
    localStorage.setItem("instructorCourses",JSON.stringify(filtered.CRNS));

    instructorinfo.innerHTML = `<h2>WELCOME &nbsp;&nbsp;&nbsp;&nbsp; ${filtered.name}</h2> 
                            <h2>Expertise: ${filtered.expertise}</h2>`
}