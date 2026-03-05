import type { IModel } from "@/api/types/IModel";
import type { IUser } from "@/api/types/IUser";
import type { TokenType } from "@/generated/prisma/enums";

export interface IToken extends IModel {
  userId: string;
  user: IUser | null;
  type: TokenType;
  tokenHash: string;
  usedAt: Date | null;
  expiresAt: Date | null;
}
