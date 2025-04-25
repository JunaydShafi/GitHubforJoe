async function loadJobs() {
    const response = await fetch('/api/jobs');
    const jobs = await response.json();
    const container = document.getElementById('jobsContainer');
  
    if (jobs.length === 0) {
      container.innerHTML = '<p>No jobs found.</p>';
      return;
    }
  
    jobs.forEach(job => {
      const div = document.createElement('div');
      div.className = 'job-card';
  
      div.innerHTML = `
        <h2>Job ID: ${job._id}</h2>
        <p><strong>Status:</strong> ${job.status}</p>
        <p><strong>Description:</strong> ${job.description}</p>
        <p><strong>Vehicle:</strong> ${job.vehicleId.make} ${job.vehicleId.model} (${job.vehicleId.year}) - Plate: ${job.vehicleId.licensePlate}</p>
        <p><strong>Mechanic:</strong> ${job.mechanicId.name}</p>
        <h4>Updates:</h4>
        <ul>${job.updates.map(update => `<li>${update}</li>`).join('')}</ul>
      `;
  
      container.appendChild(div);
    });
  }
  
  document.addEventListener('DOMContentLoaded', loadJobs);
  