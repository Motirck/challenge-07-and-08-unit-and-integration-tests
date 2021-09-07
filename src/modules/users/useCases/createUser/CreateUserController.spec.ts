import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection: Connection;

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a new user', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        name: 'Jorge Gomes',
        email: 'adminr@adminp.com',
        password: 'adminp',
      })

    expect(response.status).toBe(201);
  });

  it('Should be able to create a session', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'adminr@adminp.com',
      password: 'adminp',
    });

    expect(responseToken.body).toHaveProperty('token');
  });

  it('Should not be able to create a user with already existing email', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        name: 'Jorge Gomes',
        email: 'adminr@adminp.com',
        password: 'adminp',
      })

    expect(response.status).toBe(400);
  });
});
