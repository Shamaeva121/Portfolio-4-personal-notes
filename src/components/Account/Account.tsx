import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { fetchMe, User } from "../../api/User";
import { AuthForm } from "../AuthForm/AuthForm";
import { Loader } from "../Loader";
import NoteForm from "../NoteForm/NoteForm";
import { LogoutButton } from "../LogoutButton/LogoutButton";
import { FetchPostListView } from "../NotesListView/FetchPostListView";
import "./Account.css";
import { queryClient } from '../../api/queryClient';

interface AccountProps {
    user: User | null;
    onAuthSuccess: (user: User) => void;
    onLogout: () => void;
    refetchPosts: () => void;
}

export const Account: React.FC<AccountProps> = ({ user, onAuthSuccess, onLogout, refetchPosts }) => {
    const { data: fetchedUser, isLoading, isError } = useQuery({
        queryKey: ["users", "me"],
        queryFn: () => fetchMe(),
        enabled: !!user,
    }, queryClient);

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <AuthForm onSuccess={onAuthSuccess} />;
    }

    if (fetchedUser) {
        const username = fetchedUser.username;

        const handleLogout = async () => {
            try {
                await fetchMe(); 

                onLogout();
            } catch (error) {
                console.error("Ошибка при выходе:", error);
            }
        };

        return (
            <div className="app">
                <div className="account-header">
                    <div className="user-initials">
                        {username}
                    </div>
                    <LogoutButton onLogout={handleLogout} />
                </div>
                <div className="account-container">
                    <div className="form-block">
                        <NoteForm userId={fetchedUser.id} refetch={refetchPosts} />
                    </div>
                    <FetchPostListView />
                </div>
            </div>
        );
    }

    return null;
};