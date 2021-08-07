import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('Should be able to create an user', async () => {
    const user = {
      name: 'João Rocha',
      email: 'joao@joao.com',
      password: '12345'
    };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });

    const userFound = await inMemoryUsersRepository.findByEmail(
      user.email,
    );

    expect(userFound).toHaveProperty('id');
  });
})
