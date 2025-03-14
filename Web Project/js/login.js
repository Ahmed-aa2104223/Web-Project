let email = [];
let password = [];
let state = [];

init();

fetch("../data/email.json")
    .then(res => res.json())
    .then(data => {
        data.forEach(element => {
            email.push(element.email);
            password.push(element.password);
            state.push(element.state);
        });
        
    })

test = document.querySelector("#test");
test.innerhtml = email;
const valueEmail = document.querySelector("#e-mail");
const valuePassword = document.querySelector("#passwordd");
const submit = document.querySelector("#login");


submit.addEventListener("submit", login)

async function init() {
    if (!localStorage.getItem("codeExecuted")) {
        console.log("Running code for the first time...");
        const response = await fetch('../data/students.json');
        const data = await response.json();
        localStorage.setItem("students", JSON.stringify(data));
        const response2 = await fetch('../data/registration.json');
        const registration = await response2.json();
        localStorage.setItem("registration",JSON.stringify(registration));
        // Set a flag in localStorage to mark it as executed
        localStorage.setItem("codeExecuted", "true");

    } else {
        console.log("Code has already run before.");
    }
}

async function login(e){
    e.preventDefault();
    inputEmail = valueEmail.value;
    inputPassword = valuePassword.value;

    email.forEach((element, index) =>{
        if(element.toLowerCase() === inputEmail.toLowerCase() && password[index] === inputPassword){
            localStorage.setItem("email",inputEmail);
            window.location.href = `../html/${state[index]}.html`;
        } 
    })
    
    
}
