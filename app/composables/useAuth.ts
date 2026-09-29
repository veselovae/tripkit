export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerification: boolean;
}

export const useAuth = () => {
  const requestFetch = useRequestFetch();
  const user = useState<AuthUser | null>("auth-user", () => null);
  const loading = useState("auth-loading", () => false);

  const fetchUser = async () => {
    user.value = await requestFetch<AuthUser | null>("/api/auth/me");

    return user.value;
  };

  const register = async (input: {
    name: string;
    email: string;
    password: string;
  }) => {
    loading.value = true;

    try {
      await $fetch("/api/auth/register", {
        method: "POST",
        body: input,
      });

      await fetchUser();
    } finally {
      loading.value = false;
    }
  };

  const login = async (input: { email: string; password: string }) => {
    loading.value = true;

    try {
      await $fetch("/api/auth/login", {
        method: "POST",
        body: input,
      });

      await fetchUser();
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    await $fetch("/api/auth/logout", {
      method: "POST",
    });

    user.value = null;

    await navigateTo("/login");
  };

  return {
    user,
    loading,
    fetchUser,
    register,
    login,
    logout,
  };
};
