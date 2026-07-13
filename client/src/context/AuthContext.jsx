import { createContext, useState } from "react";
import { useEffect } from "react";
import { apiFetch } from "../utils/apiUrl";

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function login(email, password) {
    const response = await apiFetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
      credentials: "include",
    });
    const data = await response.json();
    setUser(data.user);
    return data;
  }
  async function logout() {
    const response = await apiFetch("/api/logout");
    const data = await response.json();
    setUser(data.user);
    return data;
  }

  function setLoggedInUser(user) {
    setUser(user);
  }
  useEffect(() => {
    const fetchUser = async () => {
      const response = await apiFetch("/api/user");
      const data = await response.json();
      setUser(data.user);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        login: login,
        logout: logout,
        setUser: setLoggedInUser,
        isLoading: isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
