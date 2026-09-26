import { useCallback, useState } from "react";

import { isLeft } from "../../../../core/result/result";
import type { AuthSession } from "../../domain/entities/auth_session";
import { createLoginUsecase } from "../../di";

interface AuthState {
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
}

/** Presentation-layer state holder (equivalent to a Cubit/ViewModel). */
export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    session: null,
    loading: false,
    error: null,
  });

  const login = useCallback(async (email: string, password: string) => {
    setState({ session: null, loading: true, error: null });

    const usecase = createLoginUsecase();
    const result = await usecase.call({ email, password });

    if (isLeft(result)) {
      setState({ session: null, loading: false, error: result.value.message });
      return;
    }

    setState({ session: result.value, loading: false, error: null });
  }, []);

  return { ...state, login };
};
