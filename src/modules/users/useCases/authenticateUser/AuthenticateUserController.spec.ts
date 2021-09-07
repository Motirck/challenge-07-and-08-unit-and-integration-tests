import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection: Connection;

describe('Authenticate User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app)
    .post('/api/v1/users')
    .send({
      name: 'Jorge Gomes',
      email: 'admin@admin.com',
      password: 'admin',
    })

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a session', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@admin.com',
      password: 'admin',
    });

    expect(responseToken.body).toHaveProperty('token');
  });

  it('Should not be able to authenticate user with incorrect passoword', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@admin.com',
      password: 'wrong',
    });

    expect(responseToken.status).toBe(401);
  });

  it('Should not be able to authenticate user with incorrect email', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'wrong@admin.com',
      password: 'admin',
    });

    expect(responseToken.status).toBe(401);
  });
});
