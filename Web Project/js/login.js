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