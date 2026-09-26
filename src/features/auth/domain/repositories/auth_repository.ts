import type { Failure } from "../../../../core/error/failure";
import type { Result } from "../../../../core/result/result";
import type { AuthSession } from "../entities/auth_session";

/** Abstract contract implemented by the data layer. */
export interface AuthRepository {
  login(email: string, password: string): Promise<Result<Failure, AuthSession>>;
}
