document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return alert('Please log in.');
  
    try {
      const res = await fetch(`/api/jobs/customer/${userId}`);
      const jobs = await res.json();
  
      const activeJob = jobs.find(job => job.status === 'in progress');
      if (!activeJob) {
        document.getElementById('jobWrapper').innerHTML = "<h3>No job in progress.</h3>";
        return;
      }
  
      const v = activeJob.vehicleId || {};
      const mech = activeJob.mechanicId || {};
      const start = new Date(activeJob.startDate);
  
      document.getElementById('jobHeader').innerHTML = `Job: ${v.year || 'Year'} ${v.make || ''} ${v.model || ''} (${v.licensePlate || 'No Plate'}) &nbsp; Status: ${activeJob.status}`;
      document.getElementById('dateStarted').innerHTML = `Date Started: ${start.toLocaleDateString()}`;
  
      document.getElementById('vehicleInfo').value = `${v.year || ''} ${v.make || ''} ${v.model || ''}\nPlate: ${v.licensePlate || ''}`;
      document.getElementById('appointmentInfo').value = activeJob.description || 'N/A';
      document.getElementById('mechanicInfo').value = `${mech.username || 'Unassigned'} (${mech.email || 'no contact'})`;
  
      const updates = (activeJob.updates || []).map(u => u.message).join('\n');
      document.getElementById('mechanicNotes').value = updates || 'No updates yet.';
  
      // Estimate time: placeholder calculation (2 hours total duration for example)
      const now = new Date();
      const elapsed = Math.floor((now - start) / 60000); // minutes
      const remaining = Math.max(120 - elapsed, 0);
      const hrs = Math.floor(remaining / 60);
      const mins = remaining % 60;
      document.getElementById('etaText').textContent = `Estimated Time Until Job Completion: ${hrs}h ${mins}m`;
    } catch (err) {
      console.error('Error loading job progress:', err);
      document.getElementById('jobWrapper').innerHTML = "<h3>Error loading job info.</h3>";
    }
  });
  