import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  salaryMin: {
    type: Number
  },
  salaryMax: {
    type: Number
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
    enum: {
      values: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'],
      message: '{VALUE} is not a valid job type'
    }
  },
  skills: [{
    type: String,
    trim: true
  }],
  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: {
      values: ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'],
      message: '{VALUE} is not a valid experience level'
    }
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Posted by is required']
  },
  applications: [applicationSchema],
  status: {
    type: String,
    enum: ['open', 'closed', 'filled'],
    default: 'open'
  }
}, { timestamps: true });

jobSchema.index({ jobType: 1 });
jobSchema.index({ experienceLevel: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ status: 1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
