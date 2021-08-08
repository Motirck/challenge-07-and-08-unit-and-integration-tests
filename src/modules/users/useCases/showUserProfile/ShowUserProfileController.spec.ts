import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('Show User Profile Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to show user profile', async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'Jorge Gomes',
        email: 'adminr@adminp.com',
        password: 'adminp',
      })

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@admin.com',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const profileUser = await request(app)
      .get('/api/v1/profile')
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(profileUser.status).toBe(200);
    expect(profileUser.body.length).toBe(1);
    expect(profileUser.body[0]).toHaveProperty('id');
    expect(profileUser.body[0].name).toEqual('Jorge Gomes');
  });

  // it('Should be able to create a session', async () => {
  //   const responseToken = await request(app).post('/api/v1/sessions').send({
  //     email: 'adminr@adminp.com',
  //     password: 'adminp',
  //   });

  //   expect(responseToken.body).toHaveProperty('token');
  // });

  // it('Should not be able to create a user with already existing email', async () => {
  //   const response = await request(app)
  //     .post('/api/v1/users')
  //     .send({
  //       name: 'Jorge Gomes',
  //       email: 'adminr@adminp.com',
  //       password: 'adminp',
  //     })

  //   expect(response.status).toBe(400);
  // });
});
