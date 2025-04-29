// scheduleAppointment.js

// 1. Grab the ID from URL
const urlParams = new URLSearchParams(window.location.search);
const appointmentId = urlParams.get('id');

if (!appointmentId) {
  alert('No appointment selected. Returning to Appointments.');
  window.location.href = '/appointments';
}

// 2. Listen for form submit
document.getElementById('scheduleForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const duration = parseInt(document.getElementById('duration').value);

  if (!date || !time || !duration) {
    alert('Please fill out all fields.');
    return;
  }

  // 3. Merge date and time into ISO 8601 string
  const selectedDateTime = new Date(`${date}T${time}`).toISOString();

  try {
    const res = await fetch('/api/calendar/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appointmentId,
        selectedDateTime,
        duration
      })
    });

    if (res.ok) {
      alert('Appointment successfully scheduled!');
      window.location.href = '/appointments';
    } else {
      const data = await res.json();
      alert(`Failed to schedule: ${data.message || 'Unknown error'}`);
    }
  } catch (err) {
    console.error('Error scheduling appointment:', err);
    alert('Server error.');
  }
});
