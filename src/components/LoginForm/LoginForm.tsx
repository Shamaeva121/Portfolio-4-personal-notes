import "./LoginForm.css";
import { FormField } from "../FormField";
import { Button } from "../Button";
import { FC, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login, fetchMe, User } from "../../api/User";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient } from "../../api/queryClient";

interface LoginFormProps {
    onSuccess: (user: User) => void;
}

const LoginSchema = z.object({
    email: z.string().email({ message: "Некорректный формат email" }),
    password: z.string().min(8, { message: "Пароль должен содержать не менее 8 символов" }),
});

type FormData = z.infer<typeof LoginSchema>;

export const LoginForm: FC<LoginFormProps> = ({ onSuccess }) => {
    const [loginError, setLoginError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
        resolver: zodResolver(LoginSchema),
        mode: "onChange",
    });
    const loginMutation = useMutation({
        mutationFn: async (data: FormData) => {
            try {
                await login(data.email, data.password);
                return fetchMe();
            } catch (error: any) {
                console.error("Ошибка при входе:", error);
                setLoginError("Неверный email или пароль");
                throw error;
            }
        },
        onSuccess: async (user) => {
            queryClient.invalidateQueries({ queryKey: ["users", "me"] });
            if (user) {
                onSuccess(user);
            }
        },
        onError: () => {
        }
    },
        queryClient
    )

    const onSubmit: SubmitHandler<FormData> = (data) => {
        setLoginError(null);
        loginMutation.mutate(data);
    };

    return (
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
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

            {loginError && <span className="error">{loginError}</span>}
            <Button
                kind="primary"
                type="submit"
                isLoading={loginMutation.isPending}
                disabled={!isValid || loginMutation.isPending}
            >
                Войти
            </Button>
        </form>
    );
};
