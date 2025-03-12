let email = [];
let password = [];
let state = [];

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

async function login(e){
    e.preventDefault();
    inputEmail = valueEmail.value;
    inputPassword = valuePassword.value;

    email.forEach((element, index) =>{
        if(element.toLowerCase() === inputEmail.toLowerCase() && password[index] === inputPassword){
            window.location.href = `../html/${state[index]}.html`;
        } 
    })
    
    
}
