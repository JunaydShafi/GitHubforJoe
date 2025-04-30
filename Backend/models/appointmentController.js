import { addEventToCalendar } from '../utils/googleCalendar.js';

const approveJob = async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findById(jobId);

  if (!job) return res.status(404).json({ error: 'Job not found' });

  job.status = 'Approved';
  await job.save();

  try {
    await addEventToCalendar(job);
    res.json({ message: 'Job approved and added to Google Calendar' });
  } catch (err) {
    console.error('Calendar error:', err.message);
    res.status(500).json({ error: 'Approved but calendar failed' });
  }
};
