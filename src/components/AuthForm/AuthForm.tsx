import { useState, FC } from "react";
import { LoginForm } from "../LoginForm";
import { RegisterForm } from "../RegisterForm/RegisterForm";
import { User } from "../../api/User";
import "./AuthForm.css";

interface AuthFormProps {
  onSuccess: (user: User) => void;
}

export const AuthForm: FC<AuthFormProps> = ({ onSuccess }) => {
  const [authType, setAuthType] = useState<string>("register");

  const handleClick = () => {
    setAuthType((prevState) =>
      prevState === "register" ? "auth" : "register",
    );
  };

  return (
    <div className="auth-form">
      <p className="auth-form__title">
        {authType === "register" ? "Регистрация" : "Авторизация"}
      </p>
      {authType === "register" ? <RegisterForm onSuccess={onSuccess} /> : <LoginForm onSuccess={onSuccess} />}
      <div className="auth-form__info">
        <span>
          {authType === "register" ? "Уже есть аккаунт?" : "Ещё нет аккаунта?"}
        </span>
        <button className="auth-form__button" onClick={handleClick}>
          {authType === "register" ? "Войти" : "Создать аккаунт"}
        </button>
      </div>
    </div>
  );
};
