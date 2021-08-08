import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

const user = {
  name: 'João Rocha',
  email: 'joao@joao.com',
  password: '12345'
};

const statementDeposit = {
  user_id: '',
  type: OperationType.DEPOSIT,
  amount: 500,
  description: 'Deposit for help people',
}

const statementWithdraw = {
  user_id: '',
  type: OperationType.WITHDRAW,
  amount: 600,
  description: 'Withdraw for pay bills',
}

let newUser: User;
let newStatement: Statement;

describe('Create Statement', () => {
  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)

    newUser = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });

    newStatement = await createStatementUseCase.execute({
      user_id: newUser.id,
      type: statementDeposit.type,
      amount: statementDeposit.amount,
      description: statementDeposit.description,
    })

  })

  it('Should be able to create a statement', async () => {
    expect(newStatement).toBeInstanceOf(Statement);
    expect(newStatement).toHaveProperty('id');
  });

  it('Should be able to create an user', async () => {
    expect(newUser).toBeInstanceOf(User);
    expect(newUser).toHaveProperty('id');
  });

  it('Should not be able to create a statement of not found user', async () => {
    expect(async () => {
      const fakeStatement = statementDeposit;
      fakeStatement.user_id = 'wrong id';

      await createStatementUseCase.execute(fakeStatement)
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });

  it('Should not be able to do a withdraw greater than the current balance', async () => {
    expect(async () => {
      const fakeStatement = statementWithdraw;
      fakeStatement.user_id = newUser.id;
      await createStatementUseCase.execute(statementWithdraw)
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });
})
