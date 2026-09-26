import type { AuthSession } from "../../domain/entities/auth_session";

/** Data-layer model mirroring the API response shape. */
export interface UserModel {
  id: number;
  email: string;
  access_token: string;
}

export const toAuthSession = (model: UserModel): AuthSession => ({
  userId: model.id,
  email: model.email,
  accessToken: model.access_token,
});
