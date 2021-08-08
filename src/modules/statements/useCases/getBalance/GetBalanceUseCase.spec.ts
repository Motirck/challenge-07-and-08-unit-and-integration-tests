import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase
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

describe('Statements Balance', () => {
  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)

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

  it('Should be able to get balance from user', async () => {
    const getBalance = await getBalanceUseCase.execute({user_id: newUser.id})

    expect(getBalance).toHaveProperty('balance');
    expect(getBalance.balance).toEqual(newStatement.amount);
  });

  it('Should not be able to get balance of not found user', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: 'wrong id'})
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
})
