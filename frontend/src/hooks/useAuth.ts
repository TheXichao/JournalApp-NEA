import { User } from "./useUser";
import useUser from "./useUser";

export default function useAuth() {
    const { getUser, addUser, removeUser } = useUser();

    const login = (user: User) => {
        addUser(user);
    }

    const logout = () => {
        removeUser();
    }

    const isAuthenticated = () => {
        return getUser() !== undefined;
    }

    return {
        login,
        logout,
        isAuthenticated
    }}