
let editModeEnabled = false;
document.addEventListener('DOMContentLoaded', async () => {
  const vehicleId = localStorage.getItem('selectedVehicleId');
  if (!vehicleId) return alert("No vehicle selected.");

  try {
    const res = await fetch(`/api/vehicles/${vehicleId}`);
    if (!res.ok) throw new Error('Failed to fetch vehicle info');
    const vehicle = await res.json();

    document.getElementById('vehicleTitle').textContent =
      `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}`.toUpperCase();

    // Do all your DOM population here...
    document.getElementById('vehicleMake').value = vehicle.make || '';
    document.getElementById('vehicleModel').value = vehicle.model || '';
    document.getElementById('vehicleColor').value = vehicle.color || '';
    document.getElementById('vehicleYear').value = vehicle.year || '';
    document.getElementById('vehicleNotes').value = vehicle.notes || '';

  } catch (err) {
    console.error('Failed to load vehicle info:', err);
    alert("Error loading vehicle info.");
  }
});

// ✅ Moved outside DOMContentLoaded:
function carSelect() {
  let carSelection = document.getElementById('vehicle');

  carSelection.addEventListener('change', function() {
    localStorage.setItem('carMake', vehicle.make);
    localStorage.setItem('carModel', carSelection.model);
    localStorage.setItem('carColor', carSelection.color);
    localStorage.setItem('carYear', carSelection.year);
    // location.reload();
  });

  console.log(vehicle.make);
}

async function deleteVehicleUse() {
  try {
    const vehicleRes = await fetch('http://localhost:5000/api/vehicles');
    const vehicles = await vehicleRes.json();

    const carID = localStorage.getItem('carID');
    console.log("Deleting car with ID:", carID);

    const targetVehicle = vehicles.find(vehicle => vehicle._id === carID);

    if (targetVehicle) {
      const res = await fetch(`http://localhost:5000/api/vehicles/${carID}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert("Vehicle deleted.");
        location.href = 'myCars';
      } else {
        alert("Failed to delete vehicle.");
      }
    } else {
      alert("Vehicle not found.");
    }
  } catch (err) {
    console.error("Error deleting vehicle:", err);
    alert("An error occurred while deleting the vehicle.");
  }
}

document.getElementById('deleteBtn')?.addEventListener('click', deleteVehicleUse);

// ✅ Enable Edit Mode
document.getElementById('editToggleBtn')?.addEventListener('click', () => {
  const fields = ['vehicleMake', 'vehicleModel', 'vehicleColor', 'vehicleYear', 'vehicleNotes'];
  fields.forEach(id => {
    document.getElementById(id)?.removeAttribute('readonly');
  });
  editModeEnabled = true;

  alert("Edit mode enabled. You can now make changes.");
});

// ✅ Handle Update
document.getElementById('updateBtn')?.addEventListener('click', async () => {
  if (!editModeEnabled) {
    alert("Please click 'Edit Vehicle' before updating.");
    return;
  }

  
  
  
  const vehicleId = localStorage.getItem('selectedVehicleId');
  if (!vehicleId) return alert("No vehicle selected.");

  const updatedVehicle = {
    make: document.getElementById('vehicleMake').value,
    model: document.getElementById('vehicleModel').value,
    color: document.getElementById('vehicleColor').value,
    year: document.getElementById('vehicleYear').value,
    notes: document.getElementById('vehicleNotes').value
  };
  console.log("Sending update for:", updatedVehicle);

  try {
    const res = await fetch(`/api/vehicles/${vehicleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedVehicle)
    });
    const result = await res.json();
    console.log("Update response:", result);

    if (result.success) {
      alert('Vehicle updated successfully!');
      window.location.reload();
    } else {
      alert('Update failed.');
    }
  } catch (err) {
    console.error('Update error:', err);
    alert('Server error while updating vehicle.');
  }
});
