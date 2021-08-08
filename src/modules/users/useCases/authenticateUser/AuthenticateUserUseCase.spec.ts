import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IAuthenticateUserResponseDTO } from "./IAuthenticateUserResponseDTO";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

const user = {
  name: 'João Rocha',
  email: 'joao@joao.com',
  password: '12345'
};

let newUser: User;

const session = {
  email: 'joao@joao.com',
  password: '12345'
};

let newSession: IAuthenticateUserResponseDTO;

describe('Authenticate User', () => {
  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

    newUser = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });

    newSession = await authenticateUserUseCase.execute({
      email: session.email,
      password: session.password
    });
  })

  it('Should be able to get token session', async () => {
    expect(newSession).toHaveProperty('token');
    expect(newSession.user.id).toEqual(newUser.id);
    expect(newSession.user.name).toEqual('João Rocha');
    expect(newSession.user.email).toEqual('joao@joao.com');
  });

  it('Should not be able to get token with incorrect password', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: session.email,
        password: 'wrong password'
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });

  it('Should not be able to get token with incorrect email', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'wrong@wrong.com',
        password: session.password
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });
})
