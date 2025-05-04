document.getElementById('new-employee-form').addEventListener('submit', async (e) => {
  e.preventDefault(); // stop default form reload

  const username = document.getElementById('fname-input').value.trim();
  const email = document.getElementById('email-input').value.trim();
  const password = document.getElementById('password-input').value;
  const phone = document.getElementById('phone-input').value.trim();
  const payRate = document.getElementById('payRate-input').value;
  const isAdmin = document.getElementById('isAdmin').checked;

  const role = isAdmin ? 'admin' : 'employee';

  try {
    const res = await fetch('/api/newEmployee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        email,
        password,
        phone,
        role,
        payroll: { hours: 0, minutes: 0, overtime: 0, rate: payRate || 0 }
      })
    });

    const data = await res.json();
    console.log('Server response:', data);

    if (res.ok && data.success) {
      document.getElementById('message').textContent = 'Employee created successfully!';
      document.getElementById('message').style.color = 'green';
      e.target.reset(); // clear the form
    } else {
      document.getElementById('message').textContent = data.message || 'Error creating employee.';
      document.getElementById('message').style.color = 'red';
    }
  } catch (err) {
    console.error('Error:', err);
    document.getElementById('message').textContent = 'Server error. Try again.';
    document.getElementById('message').style.color = 'red';
  }
});
