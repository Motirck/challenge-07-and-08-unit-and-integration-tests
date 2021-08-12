import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../../../../app';
import createConnection from '../../../../database';
import { v4 as uuidV4 } from 'uuid';

let connection: Connection;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let statementDeposit: any;
let statementWithdraw: any;

describe('Get Statement Operation Controller', () => {
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

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'adminr@adminp.com',
      password: 'adminp',
    });

    const { token } = responseToken.body;

    statementDeposit = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 500,
        description: 'Deposit for help people',
        type: OperationType.DEPOSIT,
      })
      .set(
        'Authorization', `Bearer ${token}`,
      )

    statementWithdraw = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 500,
        description: 'Withdraw for help people',
        type: OperationType.WITHDRAW,
      })
      .set(
        'Authorization', `Bearer ${token}`,
      )

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to get statement deposit of user', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'adminr@adminp.com',
      password: 'adminp',
    });

    const { token } = responseToken.body;

    const balance = await request(app)
      .get(`/api/v1/statements/${statementDeposit.body.id}`)
      .set(
        'Authorization', `Bearer ${token}`,
      )

    expect(balance.status).toBe(200);
  });

  it('Should be able to get statement withdraw of user', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'adminr@adminp.com',
      password: 'adminp',
    });

    const { token } = responseToken.body;

    const balance = await request(app)
      .get(`/api/v1/statements/${statementWithdraw.body.id}`)
      .set(
        'Authorization', `Bearer ${token}`,
      )

    expect(balance.status).toBe(200);
  });

  it('Should not be able to get statement of not found statement', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'adminr@adminp.com',
      password: 'adminp',
    });

    const { token } = responseToken.body;

    const balance = await request(app)
      .get(`/api/v1/statements/${uuidV4()}`)
      .set(
        'Authorization', `Bearer ${token}`,
      )

    expect(balance.status).toBe(404);
  });
});
