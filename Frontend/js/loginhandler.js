document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = form.email.value;
      const password = form.password.value;
  
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          if (data.role === 'customer') {
            window.location.href = 'customerMainPage.html';
          } else {
            alert('Only customer login is allowed.');
          }
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
        alert('Something went wrong.');
      }
    });
  });
  