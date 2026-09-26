import { httpClient } from "../../../../core/network/http_client";
import type { UserModel } from "../models/user_model";

/** Talks to the backend API. Swap this for another transport if needed. */
export class AuthDataSource {
  async login(email: string, password: string): Promise<UserModel> {
    const response = await httpClient.post<UserModel>("/auth/login", {
      email,
      password,
    });
    return response.data;
  }
}
