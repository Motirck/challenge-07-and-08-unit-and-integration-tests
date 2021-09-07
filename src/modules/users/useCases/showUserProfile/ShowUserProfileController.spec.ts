import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';
import { ShowUserProfileError } from './ShowUserProfileError';

let connection: Connection;

describe('Show User Profile Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app)
    .post('/api/v1/users')
    .send({
      name: 'Jorge Gomes',
      email: 'adminr@adminp.com',
      password: 'adminp',
    })

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to show user profile', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'adminr@adminp.com',
      password: 'adminp',
    });

    const { token } = responseToken.body;

    const profileUser = await request(app)
      .get('/api/v1/profile')
      .set(
        'Authorization', `Bearer ${token}`,
      )
    expect(profileUser.status).toBe(200);
  });
});
