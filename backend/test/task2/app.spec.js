import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../app.js';
import User from '../../models/User.js';
import Job from '../../models/Job.js';
import { setupDatabase, teardownDatabase } from '../setup.js';

chai.use(chaiHttp);
const { expect } = chai;

const JWT_SECRET = process.env.JWT_SECRET || 'jobboard-secret-key';

describe('Task 2: Job Listing Update', function () {
  this.timeout(30000);

  let authToken;
  let testUser;
  let testJob;

  before(async function () {
    await setupDatabase();

    testUser = await User.create({
      name: 'Update Employer',
      email: 'update@testcorp.com',
      password: 'password123',
      role: 'employer',
      company: 'Update Corp'
    });

    authToken = jwt.sign({ id: testUser._id }, JWT_SECRET, { expiresIn: '1d' });

    testJob = await Job.create({
      title: 'Original Job Title',
      company: 'Update Corp',
      description: 'This is the original job description before any modifications are applied.',
      location: 'Chicago, IL',
      salaryMin: 80000,
      salaryMax: 110000,
      jobType: 'Full-time',
      skills: ['JavaScript', 'Node.js'],
      experienceLevel: 'Mid',
      postedBy: testUser._id,
      status: 'open'
    });
  });

  after(async function () {
    await teardownDatabase();
  });

  it('should update the job title and return the updated document', async function () {
    const res = await chai.request(app)
      .put(`/api/jobs/${testJob._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Senior Software Engineer'
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('title', 'Senior Software Engineer');
  });

  it('should update the salary range and reflect changes in response', async function () {
    const res = await chai.request(app)
      .put(`/api/jobs/${testJob._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        salaryMin: 150000,
        salaryMax: 200000
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('salaryMin', 150000);
    expect(res.body).to.have.property('salaryMax', 200000);
  });

  it('should update the job status to closed', async function () {
    const res = await chai.request(app)
      .put(`/api/jobs/${testJob._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        status: 'closed'
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('status', 'closed');
  });

  it('should return 404 when updating a non-existent job', async function () {
    const fakeId = '507f1f77bcf86cd799439011';

    const res = await chai.request(app)
      .put(`/api/jobs/${fakeId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Ghost Job'
      });

    expect(res).to.have.status(404);
  });

  it('should reject update without authentication', async function () {
    const res = await chai.request(app)
      .put(`/api/jobs/${testJob._id}`)
      .send({
        title: 'Unauthorized Update'
      });

    expect(res).to.have.status(401);
  });
});
