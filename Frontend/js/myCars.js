const userId = localStorage.getItem('userId');
console.log("Fetching vehicles for user:", userId);

const vehicleSelect = document.getElementById('vehicle');

if (!userId) return alert("Please log in.");


try {
  const res = await fetch(`/api/vehicles/customer/${userId}`);
  const vehicles = await res.json();

  vehicles.forEach(v => {
    const option = document.createElement('option');
    option.value = v._id;
    option.textContent = `${v.year} ${v.make} ${v.model}`;
    vehicleSelect.appendChild(option);

  });
} catch (err) {
  console.error('Error loading vehicles:', err);
}
