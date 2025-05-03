async function loadJobs() {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not authenticated. Please log in.');
    }

    const res = await fetch(`/api/jobs/customer/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const jobs = await res.json();
    console.log('Jobs response:', jobs);

    const upcomingContainer = document.getElementById('upcomingAppointments');
    const inProgressContainer = document.getElementById('inProgressJobs');
    const pastJobsContainer = document.getElementById('pastJobs');

    if (jobs.length === 0) {
      upcomingContainer.innerHTML = '<p>No appointments or jobs found.</p>';
      return;
    }

    jobs.forEach(job => {
      const createdAt = new Date(job.startDate || job.createdAt);
      const formattedDate = isNaN(createdAt) ? "N/A" : `${createdAt.getMonth() + 1}/${createdAt.getDate()}/${createdAt.getFullYear()}`;

      const card = document.createElement('div');
      card.className = 'account-box';
      let content = '';

      if (job.status === 'pending') {
        content = `
          <button onclick="location.href='upcomingAppointment.html'">${formattedDate} [${job.vehicleId?.make || 'Unknown Vehicle'}]</button>
        `;
        upcomingContainer.appendChild(card);
      } else if (job.status === 'in progress') {
        content = `
          <h4>Vehicle: [${job.vehicleId?.year || ''} ${job.vehicleId?.make || ''} ${job.vehicleId?.model || ''}]</h4>
          <div style="background-color: yellow; padding: 5px; margin: 5px 0;">Status: Ongoing</div>
          <button onclick="location.href='jobProgress.html'">Job Progress</button>
          <h4>Date Started: ${formattedDate}</h4>
        `;
        inProgressContainer.appendChild(card);
      } else if (job.status === 'complete') {
        content = `
          <button onclick="location.href='jobHistory.html'">${formattedDate} [${job.vehicleId?.make || 'Unknown Vehicle'}]</button>
        `;
        pastJobsContainer.appendChild(card);
      }

      card.innerHTML = content;
    });
  } catch (error) {
    console.error('Error loading jobs:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadJobs);
