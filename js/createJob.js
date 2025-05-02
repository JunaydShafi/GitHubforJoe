document.addEventListener('DOMContentLoaded', async () => {
    const vehicleSelect = document.getElementById('vehicle');
    const mechanicSelect = document.getElementById('assignMechanic');
    const form = document.getElementById('form');
  
    // Load all vehicles
    try {
      const vehicleRes = await fetch('/api/vehicles');
      const vehicles = await vehicleRes.json();
  
      vehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle._id;
        option.textContent = `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`;
        vehicleSelect.appendChild(option);
      });
    } catch (err) {
      alert('Error loading vehicles.');
      console.error(err);
    }
  
    // Load all employees (mechanics)
    try {
      const userRes = await fetch('/api/users/employees');
      const users = await userRes.json();
  
      users.forEach(user => {
        const option = document.createElement('option');
        option.value = user._id;
        option.textContent = user.username;
        mechanicSelect.appendChild(option);
      });
    } catch (err) {
      alert('Error loading mechanics.');
      console.error(err);
    }
  
    // Form submission handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const job = {
        vehicleId: vehicleSelect.value,
        mechanicId: mechanicSelect.value,
        description: 'New service appointment',
        status: 'pending',
        appointmentDate: document.getElementById('appointmentDate').value
      };
  
      try {
        const res = await fetch('/api/jobs/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(job)
        });
  
        const data = await res.json();
  
        if (res.ok) {
          alert('Job created successfully!');
          window.location.href = '/appointments'; // 🔄 redirect after success
        } else {
          alert('Failed to create job: ' + data.message);
        }
      } catch (err) {
        alert('Server error when creating job.');
        console.error(err);
      }
    });
  });
  