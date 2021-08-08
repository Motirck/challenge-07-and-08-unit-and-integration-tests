import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createUserUseCase: CreateUserUseCase
let getStatementOperationUseCase: GetStatementOperationUseCase
let createStatementUseCase: CreateStatementUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

const user = {
  name: 'Matheus Rocha',
  email: 'matheus@matheus.com',
  password: '123456'
};

const statementDeposit = {
  user_id: '',
  type: OperationType.DEPOSIT,
  amount: 700,
  description: 'Deposit for help people in the world',
}

let newUser: User;
let newStatement: Statement;

describe('Get Statement Operation', () => {
  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)

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

  it('Should not be able to get statement operation (deposit or withdraw)', async () => {
    const statementFound = await getStatementOperationUseCase.execute({
      user_id: newUser.id,
      statement_id: newStatement.id
    })

    expect(statementFound.description).toEqual('Deposit for help people in the world');
  });

  it('Should not be able to get statement of not found user', async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: 'wrong id',
        statement_id: newStatement.id
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  });

  it('Should not be able to get statement of not found statement', async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: newUser.id,
        statement_id: 'wrong id',
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  });
})
