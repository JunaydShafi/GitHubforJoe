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
      console.log("Redirect URL from server:", data.redirect);  // Log the redirect URL

      if (data.success) {
        // Save the JWT token to localStorage (or sessionStorage)
        localStorage.setItem('authToken', data.token);  // Store the token, not userId
        console.log("Saved token to localStorage:", data.token);

        // Optionally save the user's role or other data if needed
        localStorage.setItem('userRole', data.user?.role);

        // Redirect to the dashboard or homepage after successful login
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
