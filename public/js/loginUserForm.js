// Register-Login Form
const submitForm = (form, actionURL) => {
    // Check required fields
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    form.action = actionURL;
    form.submit();
}

const formBox = document.querySelector('.form-box');
if (formBox) {
    const registerBtn = document.querySelector('.form-box .registerBtn');
    const loginBtn = document.querySelector('.form-box .loginBtn');
    const fullNameField = document.querySelector('#fullNameField');
    const title = document.querySelector('.form-box .form-title');
    const form = document.getElementById('authForm');
    const fullNameInput = `<input type="text" name="email" id="email" placeholder="Your email..." required>`;
    const linkForgotPassword = formBox.querySelector('.forgot-password');

    loginBtn.addEventListener('click', () => {
        if (loginBtn.classList.contains("disabled")) {

            linkForgotPassword.style.opacity = "1";
            fullNameField.style.maxHeight = "0";
            title.textContent = "LogIn";
            registerBtn.classList.add("disabled");
            loginBtn.classList.remove("disabled");

        } else {
            const input = fullNameField.querySelector('input');
            if (input) {
                input.remove();
            }
            submitForm(form, "/user/login");
        }
    });


    registerBtn.addEventListener('click', () => {
        if (registerBtn.classList.contains("disabled")) {
            linkForgotPassword.style.opacity = "0";

            const input = fullNameField.querySelector('input');
            if (!input) {
                fullNameField.insertAdjacentHTML('beforeend', fullNameInput);
            }
            fullNameField.style.maxHeight = "3rem";
            title.textContent = "Register";
            registerBtn.classList.remove("disabled");
            loginBtn.classList.add("disabled");
        } else {
            submitForm(form, "/user/register");
        }
    });
}

// End Register-Login Form



