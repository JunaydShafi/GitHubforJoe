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

      console.log("Logging in with:", email, password);
      console.log("Login response from server:", data);

      if (data.success) {
        localStorage.setItem('userId', data.userId);
        console.log("Saved userId to localStorage:", data.userId);

        const check = localStorage.getItem('userId');
        console.log("Retrieved from localStorage after save:", check);

        if (check) {
          window.location.href = data.redirect;
        } else {
          alert("Login failed: could not save session. Try again.");
        }
      } else {
        alert(data.message);
      }
    } 
    catch (error) {
      console.error("Login error:", error);
      alert('Something went wrong during login.');
    }
  });
});
