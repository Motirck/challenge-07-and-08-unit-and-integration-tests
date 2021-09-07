import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { Statement } from '../../entities/Statement';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { ICreateStatementDTO } from '../createStatement/ICreateStatementDTO';
import { GetStatementOperationError } from '../getStatementOperation/GetStatementOperationError';
import { TranferError } from './TranferError';

@injectable()
class TransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }

  async execute({ user_id, amount, description, sender_id, type }: ICreateStatementDTO): Promise<Statement> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new GetStatementOperationError.UserNotFound();
    }

    const sender = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
      with_statement: true
    });

    if (sender.balance < amount){
      throw new TranferError();
    }
    console.log(sender);

    const statement = await this.statementsRepository.create({
      user_id,
      amount,
      description,
      sender_id,
      type
    })

    return statement;
  }
}

export { TransferUseCase }
