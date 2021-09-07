import { Statement } from "../../entities/Statement";

export type ICreateStatementDTO =
Pick<
  Statement,
  'user_id' |
  'description' |
  'sender_id' |
  'amount' |
  'type'
>
