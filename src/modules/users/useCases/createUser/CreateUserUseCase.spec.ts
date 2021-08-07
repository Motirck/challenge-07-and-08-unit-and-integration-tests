import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

const user = {
  name: 'João Rocha',
  email: 'joao@joao.com',
  password: '12345'
};

let newUser: User;

describe('Create User', () => {
  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

    newUser = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });
  })

  it('Should be able to create an user', async () => {
    const userFound = await inMemoryUsersRepository.findByEmail(
      user.email,
    );

    expect(userFound).toHaveProperty('id');
  });

  it('Should be able to find an user by email', async () => {
    const userFound = await inMemoryUsersRepository.findByEmail(
      user.email,
    );

    expect(userFound).toHaveProperty('id');
  });

  it('Should be able to find an user by id', async () => {
    const userFound = await inMemoryUsersRepository.findById(
      newUser.id!,
    );

    expect(userFound?.name).toEqual('João Rocha');
  });

  it('Should not be able to create an user with existing email', async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });
    }).rejects.toBeInstanceOf(CreateUserError)
  });
})
