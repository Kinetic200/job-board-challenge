import User from './models/User.js';
import Job from './models/Job.js';

export async function seedDatabase() {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

  console.log('Seeding database...');

  const acmeCorp = await User.create({
    name: 'Sarah Chen',
    email: 'sarah@acmecorp.com',
    password: 'password123',
    role: 'employer',
    company: 'Acme Corp',
    bio: 'HR Director at Acme Corp, a leading software company.'
  });

  const techStart = await User.create({
    name: 'Marcus Rivera',
    email: 'marcus@techstart.io',
    password: 'password123',
    role: 'employer',
    company: 'TechStart',
    bio: 'Co-founder and CTO at TechStart, an early-stage startup.'
  });

  const jobseeker = await User.create({
    name: 'Emily Park',
    email: 'emily@email.com',
    password: 'password123',
    role: 'jobseeker',
    bio: 'Full-stack developer with 3 years of experience in React and Node.js.'
  });

  await Job.create([
    {
      title: 'Senior React Developer',
      company: 'Acme Corp',
      description: 'We are looking for an experienced React developer to join our frontend team. You will be responsible for building and maintaining our flagship web application, mentoring junior developers, and contributing to architectural decisions. The ideal candidate has deep expertise in React, TypeScript, and modern frontend tooling.',
      location: 'San Francisco, CA',
      salaryMin: 140000,
      salaryMax: 180000,
      jobType: 'Full-time',
      skills: ['React', 'TypeScript', 'Redux', 'GraphQL', 'Jest'],
      experienceLevel: 'Senior',
      postedBy: acmeCorp._id,
      status: 'open'
    },
    {
      title: 'Backend Engineer',
      company: 'Acme Corp',
      description: 'Join our backend team to design and build scalable microservices. You will work with Node.js, PostgreSQL, and AWS to deliver reliable APIs that power our platform. Strong understanding of distributed systems and database optimization is a plus.',
      location: 'San Francisco, CA',
      salaryMin: 130000,
      salaryMax: 170000,
      jobType: 'Full-time',
      skills: ['Node.js', 'PostgreSQL', 'AWS', 'Docker', 'REST APIs'],
      experienceLevel: 'Mid',
      postedBy: acmeCorp._id,
      status: 'open'
    },
    {
      title: 'Full-Stack Intern',
      company: 'TechStart',
      description: 'Great opportunity for students or recent graduates to gain hands-on experience in a fast-paced startup environment. You will work across the stack using React and Express.js, participate in code reviews, and ship features to real users from day one.',
      location: 'Austin, TX',
      salaryMin: 25,
      salaryMax: 35,
      jobType: 'Internship',
      skills: ['JavaScript', 'React', 'Node.js', 'Git'],
      experienceLevel: 'Entry',
      postedBy: techStart._id,
      status: 'open'
    },
    {
      title: 'DevOps Engineer (Remote)',
      company: 'TechStart',
      description: 'We need a DevOps engineer to build and maintain our CI/CD pipelines, manage cloud infrastructure on AWS, and improve our deployment processes. This is a fully remote position open to candidates anywhere in the US.',
      location: 'Remote',
      salaryMin: 120000,
      salaryMax: 155000,
      jobType: 'Remote',
      skills: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'GitHub Actions'],
      experienceLevel: 'Mid',
      postedBy: techStart._id,
      status: 'open'
    },
    {
      title: 'UX Designer (Contract)',
      company: 'Acme Corp',
      description: 'Six-month contract to redesign our customer-facing dashboard. You will conduct user research, create wireframes and prototypes, and work closely with engineers to deliver a polished experience. Experience with design systems and accessibility standards is essential.',
      location: 'New York, NY',
      salaryMin: 70,
      salaryMax: 95,
      jobType: 'Contract',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility'],
      experienceLevel: 'Senior',
      postedBy: acmeCorp._id,
      status: 'open'
    },
    {
      title: 'Part-Time Data Analyst',
      company: 'TechStart',
      description: 'Looking for a data analyst to work 20 hours per week helping us make sense of our product metrics. You will build dashboards, run SQL queries, and present findings to the leadership team. Flexible hours.',
      location: 'Austin, TX',
      salaryMin: 40000,
      salaryMax: 55000,
      jobType: 'Part-time',
      skills: ['SQL', 'Python', 'Tableau', 'Excel', 'Statistics'],
      experienceLevel: 'Entry',
      postedBy: techStart._id,
      status: 'open'
    }
  ]);

  console.log('Database seeded successfully');
}
