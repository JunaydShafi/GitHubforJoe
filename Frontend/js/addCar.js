document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-car-form');
  
    const customerId = localStorage.getItem('userId');
    console.log("Customer ID loaded from localStorage:", customerId);
  
    if (!customerId) {
      alert('No customer is logged in. Please log in again.');
      window.location.href = 'login.html'; // or DASHPORTAL.html
      return;
    }
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const payload = {
        customerId,
        make: form.make.value,
        model: form.model.value,
        color: form.color.value,
        year: form.year.value,
        vin: form.vin.value,
        licensePlate: form.licensePlate.value
      };
  
      try {
        const res = await fetch('/api/vehicles/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
  
        const data = await res.json();
        console.log("Add Car Response:", data);
        document.getElementById('car-message').textContent = data.message;
      } catch (err) {
        console.error("Error adding car:", err);
        document.getElementById('car-message').textContent = 'Server error occurred.';
      }
    });
  });
  