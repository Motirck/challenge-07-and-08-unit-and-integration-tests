import { AppError } from "../../../../shared/errors/AppError";

export class TranferError extends AppError {
  constructor() {
    super('Unable to transfer due to insufficient account balance', 400);
  }
}
