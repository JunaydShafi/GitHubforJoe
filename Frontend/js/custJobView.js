async function loadJobs() {
  try {
    const userId = localStorage.getItem('userId'); // ✅ Correct way
    if (!userId) {
      throw new Error('User not authenticated. Please log in.');
    }

    const response = await fetch(`/api/jobs/customer/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const jobs = await response.json();
    console.log('Jobs response:', jobs);

    const container = document.getElementById('jobsContainer');
    container.innerHTML = '';

    if (jobs.length === 0) {
      container.innerHTML = '<p>No jobs found.</p>';
      return;
    }

    jobs.forEach(job => {
      const div = document.createElement('div');
      div.className = 'job-card';

      const createdAt = new Date(job.startDate); // ✅ safer to use startDate if you want when job started
      const formattedDate = isNaN(createdAt) ? "N/A" : `${createdAt.getMonth() + 1}/${createdAt.getDate()}/${createdAt.getFullYear()}`;

      div.innerHTML = `
        <h2>Job Created: ${formattedDate}</h2>
        <p><strong>Status:</strong> ${job.status}</p>
        <p><strong>Description:</strong> ${job.description || 'N/A'}</p>
        <p><strong>Vehicle:</strong> ${job.vehicleId?.year || 'Unknown'} ${job.vehicleId?.make || ''} ${job.vehicleId?.model || ''} (${job.vehicleId?.licensePlate || 'No Plate'})</p>
        <p><strong>Mechanic:</strong> ${job.mechanicId?.username || 'TBD'}</p>
        <h4>Updates:</h4>
        <ul>${(job.updates || []).map(update => `<li>${update.message}</li>`).join('')}</ul>
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
