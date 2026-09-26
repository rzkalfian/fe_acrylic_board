import { isAxiosError } from "axios";

import { Failure } from "../../../../core/error/failure";
import { left, right, type Result } from "../../../../core/result/result";
import type { AuthSession } from "../../domain/entities/auth_session";
import type { AuthRepository } from "../../domain/repositories/auth_repository";
import { AuthDataSource } from "../datasources/auth_datasource";
import { toAuthSession } from "../models/user_model";

/** Concrete implementation, mapping datasource exceptions to Failures. */
export class AuthRepositoryImpl implements AuthRepository {
  private readonly datasource: AuthDataSource;

  constructor(datasource: AuthDataSource) {
    this.datasource = datasource;
  }

  async login(email: string, password: string): Promise<Result<Failure, AuthSession>> {
    try {
      const model = await this.datasource.login(email, password);
      return right(toAuthSession(model));
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status ?? 0;
        const message = error.response?.data?.detail ?? error.message ?? "Login failed";
        return left(new Failure(message, status));
      }
      return left(new Failure(String(error), 500));
    }
  }
}
