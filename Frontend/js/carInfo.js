
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
    console.log("NOTES FROM BACKEND:", vehicle.notes);

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
  const carID = localStorage.getItem('selectedVehicleId');
  if (!carID) return alert("No vehicle selected.");

  try {
    const res = await fetch(`/api/vehicles/${carID}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert("Vehicle deleted.");
      location.href = 'myCars'; // redirect after deletion
    } else {
      alert("Failed to delete vehicle.");
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