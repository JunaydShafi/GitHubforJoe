document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('new-employee-form');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const payload = {
        email: formData.get('email'),
        username: formData.get('username'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        isAdmin: formData.get('isAdmin') === 'on'
      };
  
      try {
        const res = await fetch('/api/employees/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
  
        const data = await res.json();
        document.getElementById('message').textContent = data.message;
      } catch (err) {
        console.error(err);
        document.getElementById('message').textContent = 'Error creating employee.';
      }
    });
  });
  