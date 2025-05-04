document.addEventListener('DOMContentLoaded', async () => {
  const vehicleSelect = document.getElementById('vehicle');

  const customerId = localStorage.getItem('userId');
  console.log("Customer ID loaded from localStorage:", customerId);
  

  try {
      const vehicleRes = await fetch('/api/vehicles');
      const vehicles = await vehicleRes.json();
  
      vehicles.forEach(vehicle => {
        //let vechileID = vehicle.customerId;
        console.log(vehicle.customerId._id);
        if (customerId == vehicle.customerId._id) {
        //console.log(vehicle.customerId);
          const option = document.createElement('option');
          option.value = vehicle._id;
          option.textContent = `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`;
          vehicleSelect.appendChild(option);
        }
      });
      //console.log(vehicleSelect.querySelectorAll('vehicle'));
    } catch (err) {
      alert('Error loading vehicles.');
      console.error(err);
    }
  console.log(document.getElementById('vehicle'));
});