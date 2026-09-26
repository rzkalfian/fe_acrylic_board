import type { Failure } from "../../../../core/error/failure";
import type { Result } from "../../../../core/result/result";
import type { AuthSession } from "../entities/auth_session";
import type { AuthRepository } from "../repositories/auth_repository";

export interface LoginParams {
  email: string;
  password: string;
}

/** Usecase: authenticate a user and return an auth session. */
export class Login {
  private readonly repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  call(params: LoginParams): Promise<Result<Failure, AuthSession>> {
    return this.repository.login(params.email, params.password);
  }
}
