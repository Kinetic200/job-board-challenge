import express from 'express';
import Job from '../models/Job.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { jobType, experienceLevel, location, status, postedBy } = req.query;
    const filter = {};

    if (jobType) filter.jobType = jobType;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (status) filter.status = status;
    if (postedBy) filter.postedBy = postedBy;

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email company')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email company')
      .populate('applications.applicant', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, company, desc, location, salaryMin, salaryMax, jobType, skills, experienceLevel } = req.body;

    const job = new Job({
      title,
      company,
      description: desc,
      location,
      salaryMin,
      salaryMax,
      jobType,
      skills: skills || [],
      experienceLevel,
      postedBy: req.user.id
    });

    await job.save();

    const populatedJob = await Job.findById(job._id)
      .populate('postedBy', 'name email company');

    res.status(201).json(populatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job listing' });
    }

    const updates = { ...req.body };

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      updates,
      { runValidators: true }
    ).populate('postedBy', 'name email company');

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job listing' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/apply', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ message: 'This job is no longer accepting applications' });
    }

    const alreadyApplied = job.applications.some(
      (app) => app.applicant.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    job.applications.push({
      applicant: req.user.id,
      coverLetter: req.body.coverLetter || ''
    });

    await job.save();

    const updatedJob = await Job.findById(job._id)
      .populate('postedBy', 'name email company')
      .populate('applications.applicant', 'name email');

    res.status(201).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
