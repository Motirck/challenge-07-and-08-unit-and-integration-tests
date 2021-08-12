import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('Get Balance Controller', () => {
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

  it('Should be able to show a balance of user', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'adminr@adminp.com',
      password: 'adminp',
    });

    const { token } = responseToken.body;

    const balance = await request(app)
      .get('/api/v1/statements/balance')
      .set(
        'Authorization', `Bearer ${token}`,
      )

    expect(balance.status).toBe(200);
  });
});
