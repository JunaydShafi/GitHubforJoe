async function loadJobs() {
  try {
  // Get the JWT token from localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User not authenticated. Please log in.');
    }

    // Send a GET request to the /api/jobs endpoint with the Authorization header
    const response = await fetch('/api/jobs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Include the JWT token in the Authorization header
      },
    });

    const jobs = await response.json();

    console.log('Jobs response:', jobs);

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
  } catch (error) {
    console.error('Error loading jobs:', error);
    const container = document.getElementById('jobsContainer');
    container.innerHTML = '<p>Error loading jobs. Please try again later.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadJobs);
