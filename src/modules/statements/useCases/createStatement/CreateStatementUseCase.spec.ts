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

const statement = {
  user_id: '',
  type: OperationType.DEPOSIT,
  amount: 500,
  description: 'Deposit for help people',
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
      type: statement.type,
      amount: statement.amount,
      description: statement.description,
    })

  })

  it('Should be able to create a statement', async () => {
    expect(newStatement).toBeInstanceOf(Statement);
    expect(newStatement).toHaveProperty('id');
  });

  it('Should not be able to create a statement of not found user', async () => {
    expect(async () => {
      const fakeStatement = statement;
      fakeStatement.user_id = 'wrong id';

      await createStatementUseCase.execute(fakeStatement)
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });
})
