import { AuthDataSource } from "./data/datasources/auth_datasource";
import { AuthRepositoryImpl } from "./data/repositories/auth_repository_impl";
import { Login } from "./domain/usecases/login";

/** Wires the feature's dependency graph (datasource -> repository -> usecase). */
export const createLoginUsecase = (): Login => {
  const datasource = new AuthDataSource();
  const repository = new AuthRepositoryImpl(datasource);
  return new Login(repository);
};
