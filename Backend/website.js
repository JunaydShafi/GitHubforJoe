const form = document.getElementById('form')
const firstname_input = document.getElementById('firstname-input')
const email_input = document.getElementById('email-input')
const phonenumber_input = document.getElementById('phonenumber-input')
const password_input = document.getElementById('password-input')
const confirm_input = document.getElementById('confirm-password-input')
const error_message = document.getElementById('error-message')

form.addEventListener('submit', (e) => {

    let errors = [] // array to store errors

    if(firstname_input)
    {// if valid firstname then go to signup
        errors = getSignupFromErrors(firstname_input.value, email_input.value, phonenumber_input.value, password_input.value, confirm_input.value)
    }
    else{// if their is no firstname then we are in login
        errors = getLoginFormErrors(email_input.value, password_input.value)
    }

    if(errors.length > 0){// if there are anny errors
        e.preventDefault()
        error_message.innerText = errors.join('. ')
    }
})

function getSignupFromErrors(firstname, email, phonenumber, password, confirmpassword)// catch errors for sighnup
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

    if(password.length < 8)
    {   
        errors.push('Password must have at least 8 characters')
        password_input.parentElement.classList.add('incorrect')
    }

    
    if(password !== confirmpassword)
    {
        errors.push('Password does not match confirm password')
        password_input.parentElement.classList.add('incorrect')
        confirm_input.parentElement.classList.add('incorrect')
    }
    return errors;
}

function getLoginFormErrors(email, password)// catch errors for login page
{
    let errors = []

    if(email === '' || email == null)
    {
        errors.push('email is required')
        email_input.parentElement.classList.add('incorrect')
    }

    if(password === '' || password == null)
    {
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }
    if(password.length < 8)
    {   
        errors.push('Password must have at least 8 characters')
        password_input.parentElement.classList.add('incorrect')
    }

    return errors;
}

const allInputs = [firstname_input, email_input, phonenumber_input, password_input, confirm_input].filter(input => input != null)// array to contain all emelemts. The filter filteres so the error messages go away
 
allInputs.forEach(input =>{// remove error message
    input.addEventListener('input', () => {
        if(input.parentElement.classList.contains('incorrect'))
        {
            input.parentElement.classList.remove('incorrect')
            error_message.innerText =''
        }
    })
})
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
  
    if (form && window.location.pathname === '/signup') {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
  
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
  
        try {
          const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
  
          const text = await res.text();
  
          if (res.status === 201) {
            alert('Signup successful! Redirecting to login...');
            window.location.href = '/login';
          } else {
            document.getElementById('error-message').innerText = text || 'Signup failed.';
          }
        } catch (err) {
          console.error(err);
          document.getElementById('error-message').innerText = 'Error during signup.';
        }
      });
    }
  });
  