import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

let showUserProfileUseCase: ShowUserProfileUseCase
let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

const user = {
  name: 'João Rocha',
  email: 'joao@joao.com',
  password: '12345'
};

let newUser: User;

describe('Profile User', () => {
  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

    newUser = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });
  })

  it('Should be able to show profile user', async () => {
    const profileUser = await showUserProfileUseCase.execute(newUser.id)
    expect(profileUser).toBeInstanceOf(User);
  });

  it('Should not be able to show profile of not found user', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('wrong id')
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  });
})
