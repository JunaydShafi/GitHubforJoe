document.addEventListener('DOMContentLoaded', () => {
    const jobData = localStorage.getItem('selectedJob');
    if (!jobData) {
      alert("No job selected.");
      return;
    }
  
    const job = JSON.parse(jobData);
    const vehicle = job.vehicleId || {};
    const mechanic = job.mechanicId || {};
    const completedDate = new Date(job.completedDate).toLocaleDateString();
  
    // Header
    document.getElementById('jobHeader').innerHTML = `Job: ${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''} &nbsp; Status: ${job.status}`;
    document.getElementById('dateCompleted').textContent = `Date Completed: ${completedDate}`;
  
    // Vehicle Info
    document.getElementById('vehicleInfo').value = `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}\nPlate: ${vehicle.licensePlate || 'N/A'}`;
  
    // Appointment Info
    document.getElementById('appointmentInfo').value = job.description || 'N/A';
  
    // Mechanic Info
    document.getElementById('mechanicInfo').value = `${mechanic.username || 'Unassigned'} (${mechanic.email || 'No email'})`;
  
    // Updates / Notes
    const updates = (job.updates || []).map(u => u.message).join('\n');
    document.getElementById('mechanicNotes').value = updates || 'No updates.';
  });
  