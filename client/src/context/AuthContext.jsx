import { createContext, useState } from "react";
import { useEffect } from "react";
import { apiFetch } from "../utils/apiUrl";

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  hasContacts: null,
  setHasContacts: () => {},
  authIssue: null,
  setAuthIssue: () => {},
});
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authIssue, setAuthIssue] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasContacts, setHasContacts] = useState(false);

  async function login(email, password) {
    const response = await apiFetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await response.json();
    setUser(data.user);
    setHasContacts(data.hasContacts);
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
      setHasContacts(data.hasContacts);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        hasContacts: hasContacts,
        setHasContacts: setHasContacts,
        authIssue: authIssue,
        setAuthIssue: setAuthIssue,
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
