const sign_in_btn = document.querySelector("#sign-in-btn");//find elements using CSS selector
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () =>{ //CSS transitions reveal the sign-up form and hide sign-in
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click', () =>{ //clicking “Sign in” removes the class so the sign-in form is visible again
    container.classList.remove("sign-up-mode");
});