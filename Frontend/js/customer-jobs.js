async function loadCustomerJobs() {
    const customerId = localStorage.getItem('customerId'); 
  
    if (!customerId) {
      alert("Customer ID not found. Are you logged in?");
      return;
    }
  
    try {
      const res = await fetch(`/api/jobs/customer/${customerId}`);
      const jobs = await res.json();
  
      const container = document.getElementById('job-list');
      container.innerHTML = '';
  
      if (jobs.length === 0) {
        container.innerHTML = '<p>No jobs found for your vehicles.</p>';
        return;
      }
  
      jobs.forEach(job => {
        const jobDiv = document.createElement('div');
        jobDiv.classList.add('job-entry');
        jobDiv.innerHTML = `
          <h3>${job.vehicleId.make} ${job.vehicleId.model} (${job.vehicleId.year})</h3>
          <p><strong>Status:</strong> ${job.status}</p>
          <p><strong>Assigned Mechanic:</strong> ${job.mechanicId.name}</p>
          <p><strong>Description:</strong> ${job.description}</p>
          <h4>Updates:</h4>
          <ul>
            ${job.updates.map(update => `
              <li>${new Date(update.date).toLocaleString()}: ${update.message}</li>
            `).join('')}
          </ul>
          <hr>
        `;
        container.appendChild(jobDiv);
      });
    } catch (err) {
      console.error(err);
      alert("Error fetching job data.");
    }
  }
  
  document.addEventListener('DOMContentLoaded', loadCustomerJobs);
  