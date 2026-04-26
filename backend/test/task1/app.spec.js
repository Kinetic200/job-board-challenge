import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app.js';
import { setupDatabase, teardownDatabase } from '../setup.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Task 1: Job Listing Creation', function () {
  this.timeout(30000);

  let authToken;
  let userId;

  before(async function () {
    await setupDatabase();

    const registerRes = await chai.request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Employer',
        email: 'employer@testcorp.com',
        password: 'password123',
        role: 'employer',
        company: 'Test Corp'
      });

    authToken = registerRes.body.token;
    userId = registerRes.body.user._id;
  });

  after(async function () {
    await teardownDatabase();
  });

  it('should create a new job listing and return 201 status', async function () {
    const res = await chai.request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Frontend Developer',
        company: 'Test Corp',
        description: 'We are hiring a frontend developer with experience in React and modern JavaScript frameworks. The role involves building responsive user interfaces and collaborating with the design team.',
        location: 'San Francisco, CA',
        salaryMin: 100000,
        salaryMax: 140000,
        jobType: 'Full-time',
        skills: ['React', 'JavaScript', 'CSS', 'TypeScript'],
        experienceLevel: 'Mid'
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('title', 'Frontend Developer');
    expect(res.body).to.have.property('description').that.includes('frontend developer');
    expect(res.body).to.have.property('company', 'Test Corp');
    expect(res.body).to.have.property('jobType', 'Full-time');
    expect(res.body).to.have.property('experienceLevel', 'Mid');
    expect(res.body).to.have.property('postedBy');
    expect(res.body.postedBy).to.have.property('name', 'Test Employer');
  });

  it('should create a job with skills array and salary range', async function () {
    const res = await chai.request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Data Scientist',
        company: 'Test Corp',
        description: 'Looking for a data scientist to analyze large datasets and build predictive models using Python and machine learning frameworks.',
        location: 'Remote',
        salaryMin: 120000,
        salaryMax: 160000,
        jobType: 'Remote',
        skills: ['Python', 'TensorFlow', 'SQL', 'Pandas'],
        experienceLevel: 'Senior'
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('skills').that.is.an('array').with.lengthOf(4);
    expect(res.body.skills).to.include('Python');
    expect(res.body).to.have.property('salaryMin', 120000);
    expect(res.body).to.have.property('salaryMax', 160000);
  });

  it('should create a job with default open status', async function () {
    const res = await chai.request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'QA Engineer',
        company: 'Test Corp',
        description: 'Join our quality assurance team to write automated tests and ensure our product meets the highest standards of reliability.',
        location: 'Austin, TX',
        jobType: 'Full-time',
        skills: ['Selenium', 'Jest', 'Cypress'],
        experienceLevel: 'Entry'
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('status', 'open');
    expect(res.body).to.have.property('applications').that.is.an('array').with.lengthOf(0);
  });

  it('should populate the postedBy field with employer info', async function () {
    const res = await chai.request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Mobile Developer',
        company: 'Test Corp',
        description: 'Build and maintain cross-platform mobile applications using React Native for both iOS and Android platforms.',
        location: 'New York, NY',
        jobType: 'Full-time',
        skills: ['React Native', 'iOS', 'Android'],
        experienceLevel: 'Mid'
      });

    expect(res).to.have.status(201);
    expect(res.body.postedBy).to.have.property('email', 'employer@testcorp.com');
    expect(res.body.postedBy).to.have.property('company', 'Test Corp');
  });

  it('should reject job creation without authentication', async function () {
    const res = await chai.request(app)
      .post('/api/jobs')
      .send({
        title: 'Unauthorized Job',
        company: 'No Auth Corp',
        description: 'This should not be created.',
        location: 'Nowhere',
        jobType: 'Full-time',
        experienceLevel: 'Entry'
      });

    expect(res).to.have.status(401);
  });
});
