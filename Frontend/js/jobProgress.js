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
  
      const now = new Date();
      const elapsed = Math.floor((now - start) / 60000);
      const remaining = Math.max(120 - elapsed, 0);
      const hrs = Math.floor(remaining / 60);
      const mins = remaining % 60;
  
      const estimate = parseInt(activeJob.estimatedMinutes, 10) || 120;
      console.log('Starting progress bar with:', activeJob.startDate, estimate);
  
      startProgressBar(activeJob.startDate, estimate);
  
    } catch (err) {
      console.error('Error loading job progress:', err);
      document.getElementById('jobWrapper').innerHTML = "<h3>Error loading job info.</h3>";
    }
  });
  
  function startProgressBar(startDate, estimatedMinutes) {
    const fill = document.getElementById('progressBarFill');
    const status = document.getElementById('progressStatus');
  
    if (!fill || !status) return;
  
    fill.style.display = 'block';
  
    function updateBar() {
      const now = new Date();
      const start = new Date(startDate);
      const elapsed = (now - start) / 60000;
      const percent = Math.min((elapsed / estimatedMinutes) * 100, 100);
      fill.style.width = `${percent.toFixed(1)}%`;
      fill.textContent = `${Math.floor(percent)}%`;
  
      const remaining = Math.max(0, estimatedMinutes - elapsed);
      status.textContent = remaining > 0
        ? `Estimated time remaining: ${Math.floor(remaining)} min`
        : 'Job should be completed soon.';
    }
  
    updateBar();
    setInterval(updateBar, 30000);
  }
  