import api from "@/utils/api";

export const AuthService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    if (__DEV__) {
      console.log(response.data);
    }
    return response.data; // { user, token }
  },

  logout: async () => {
    return api.post("/logout");
  },

  register: async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    const response = await api.post("/register", userData);
    return {
      user: response.data.user,
      token: response.data.token,
    };
  },

  me: async () => {
    return api.get("/me");
  },
};
