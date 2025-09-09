import { FormField } from "../FormField";
import { Button } from "../Button";
import "./RegisterForm.css";
import { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerUser, login, fetchMe, User } from "../../api/User";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from 'react';

interface RegisterFormProps {
    onSuccess: (user: User) => void;
}

const RegisterSchema = z.object({
    username: z.string().min(5, { message: "Имя пользователя должно содержать не менее 5 символов" }),
    email: z.string().email({ message: "Некорректный формат email" }),
    password: z.string().min(8, { message: "Пароль должен содержать не менее 8 символов" }),
});

type FormData = z.infer<typeof RegisterSchema>;

export const RegisterForm: FC<RegisterFormProps> = ({ onSuccess }) => {

     const [registrationError, setRegistrationError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
        resolver: zodResolver(RegisterSchema),
        mode: "onChange",
    });

 const registrMutation = useMutation({
        mutationFn: async (data: FormData) => { 
            try {
                await registerUser(data.username, data.password, data.email);
                await login(data.email, data.password);
                const user = await fetchMe();
                return user; 
            } catch (error: any) {
                console.error("Ошибка при регистрации:", error);

                if (error.message.includes("409")) {
                    setRegistrationError("Пользователь с таким email уже зарегистрирован");
                } else {
                    setRegistrationError("Произошла ошибка при регистрации");
                }
                throw error; 
            }
        },
        onSuccess: (user) => { 
            if (user) {
                alert("Регистрация прошла успешно!");
                onSuccess(user);
            }
        },
        onError: (error: any) => {
            console.error("Ошибка при регистрации:", error);
        },
    });

    const onSubmit: SubmitHandler<FormData> = (data) => {
        setRegistrationError(null);
        registrMutation.mutate(data);
    };

    return (
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Имя">
                <input
                    type="text"
                    {...register("username")}
                />
                {errors.username && <span className="error">{errors.username.message}</span>}
            </FormField>
            <FormField label="Email">
                <input
                    type="email"
                    {...register("email")}
                />
                {errors.email && <span className="error">{errors.email.message}</span>}
            </FormField>
            <FormField label="Пароль">
                <input
                    type="password"
                    {...register("password")}
                />
                {errors.password && <span className="error">{errors.password.message}</span>}
            </FormField>

            {registrationError && <span className="error">{registrationError}</span>}

            <Button 
                kind="primary" 
                type="submit" 
                isLoading={registrMutation.isPending} 
                disabled={!isValid} 
            >
                Зарегистрироваться
            </Button>
        </form>
    );
};
