document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log("Logging in with:", email, password);
      console.log("Login response from server:", data);
      console.log("Redirect URL from server:", data.redirect);

      if (data.success) {
        localStorage.setItem('authToken', data.token);   // ✅ token
        localStorage.setItem('userId', data.user?.id);    // ✅ ADD THIS
        localStorage.setItem('userRole', data.user?.role);

        console.log("Saved token:", data.token);
        console.log("Saved userId:", data.user?.id);

        window.location.href = data.redirect;
      } else {
        alert(data.error || 'Login failed');
      }
    } 
    catch (error) {
      console.error("Login error:", error);
      alert('Something went wrong during login.');
    }
  });
});
