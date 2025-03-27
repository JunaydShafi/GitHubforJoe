const form = document.getElementById('form')
const firstname_input = document.getElementById('firstname-input')
const email_input = document.getElementById('email-input')
const phonenumber_input = document.getElementById('phonenumber-input')
const password_input = document.getElementById('password-input')
const confirm_input = document.getElementById('confirm-password-input')
const error_message = document.getElementById('error-message')

form.addEventListener('submit', (e) => {

    let errors = []

    if(firstname_input)
    {// if valid firstname then go to signup
        errors = getSignupFromErrors(firstname_input.ariaValueMax, email_input.ariaValueMax, phonenumber_input.ariaValueMax, password_input.ariaValueMax, confirm_input.value)
    }
    else{// if their is no firstname then we are in login
        errors = getLoginFormErrors(email_input.value, password_input.value)
    }

    if(errors.length > 0){
        e.preventDefault()
        error_message.innerText = errors.join('. ')
    }
})

function getSignupFromErrors(firstname, email, phonenumber, password, confirmpassword)
{
    let errors = []

    if(firstname === '' || firstname == null)
    {
        errors.push('Firstname is required')
        firstname_input.parentElement.classList.add('incorrect')
    }

    if(email === '' || email == null)
        {
            errors.push('email is required')
            email_input.parentElement.classList.add('incorrect')
        }

    if(phonenumber === '' || phonenumber == null)
        {
            errors.push('phonenumber is required')
            phonenumber_input.parentElement.classList.add('incorrect')
        }

    if(password === '' || password == null)
        {
            errors.push('password is required')
            password_input.parentElement.classList.add('incorrect')
        }
    return errors;
}