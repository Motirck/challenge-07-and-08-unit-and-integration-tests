import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement Controller', () => {
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

  it('Should be able to do a deposit', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'adminr@adminp.com',
      password: 'adminp',
    });

    const { token } = responseToken.body;

    const statement = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 500,
        description: 'Deposit for help people',
        type: OperationType.DEPOSIT,
      })
      .set(
        'Authorization', `Bearer ${token}`,
      )
    expect(statement.status).toBe(201);
  });

  it('Should be able to do a withdraw', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'adminr@adminp.com',
      password: 'adminp',
    });

    const { token } = responseToken.body;

    const statement = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 500,
        description: 'Withdraw for help people',
        type: OperationType.WITHDRAW,
      })
      .set(
        'Authorization', `Bearer ${token}`,
      )

    expect(statement.status).toBe(201);
  });

  it('Should not be able to do a withdraw greater than the current balance', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'adminr@adminp.com',
      password: 'adminp',
    });

    const { token } = responseToken.body;

    await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 500,
        description: 'Deposit for help people',
        type: OperationType.DEPOSIT,
      })
      .set(
        'Authorization', `Bearer ${token}`,
      )

    const statementWithdraw = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 1000,
        description: 'Deposit for help people',
        type: OperationType.WITHDRAW,
      })
      .set(
        'Authorization', `Bearer ${token}`,
      )

    expect(statementWithdraw.status).toBe(400);
  });
});
