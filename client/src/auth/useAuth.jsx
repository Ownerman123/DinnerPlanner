import { createContext, useState, useEffect, useContext } from "react";
import AuthService from "./auth.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(AuthService.loggedIn());
  const [user, setUser] = useState(null);
  useEffect(() => {
    const checkLoginStatus = async () => {
      console.log("checking logged status")
      const loggedIn = await AuthService.loggedIn();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        setUser(AuthService.getProfile());
        console.log("status good")
      } else {
        setUser(null);
        console.log("no user");
      }
    };
    checkLoginStatus();
    // You could add an interval here to periodically check token expiration
    // const interval = setInterval(checkLoginStatus, 60000); // Check every minute
    // return () => clearInterval(interval);
  }, []);
  const login = (idToken) => {
    try {
      AuthService.login(idToken);
      setIsLoggedIn(true);
      setUser(AuthService.getProfile());
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const logout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        ...user,
        getProfile: AuthService.getProfile,
        getToken: AuthService.getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
