import { IUser } from "@/api/types/IUser";
import { IModel } from "@/api/types/IModel";
import { TokenType } from "@/generated/prisma/enums";

export interface IToken extends IModel {
  userId: string;
  user: IUser | null;
  type: TokenType;
  tokenHash: string;
  usedAt: Date | null;
  expiresAt: Date | null;
}
