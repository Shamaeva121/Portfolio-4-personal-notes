import "./App.css";
import { useState } from "react";
import { User } from "./api/User";
import { Account } from "./components/Account/Account";
import { AuthForm } from "./components/AuthForm/AuthForm";
import { useQueryClient } from "@tanstack/react-query";

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");
    if (storedUserId && storedUsername) {
      return {
        id: storedUserId,
        username: storedUsername,
      } as User;
    }
    return null;
  });

  const queryClient = useQueryClient();

  const handleAuthSuccess = (user: User) => {
    localStorage.setItem("userId", user.id);
    localStorage.setItem("username", user.username);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setUser(null);
  };

  const refetchPosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <div className="app-container">
      {!user ? (
        <div className="app">
          <AuthForm onSuccess={handleAuthSuccess} />
        </div>
      ) : (
        <div>
          <Account
            user={user}
            onAuthSuccess={handleAuthSuccess}
            onLogout={handleLogout}
            refetchPosts={refetchPosts}
          />
        </div>
      )}
    </div>
  );
}

export default App;