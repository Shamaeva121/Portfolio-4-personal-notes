import { Button } from "../Button";
import "./LogoutButton.css";
import { useQueryClient } from "@tanstack/react-query";

interface LogoutButtonProps {
    onLogout: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      queryClient.clear();
      onLogout(); 
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <div className="logout-button">
      <Button kind="secondary" onClick={handleLogout}>Выйти</Button>
    </div>
  );
};
