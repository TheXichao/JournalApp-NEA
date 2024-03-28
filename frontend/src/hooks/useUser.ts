import Cookies from "universal-cookie";
import useUserContext from "./useUserContext";

export interface User {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    authToken?: string;
    email_prompt: boolean;
  }
export default function useUser() {
    const { updateUser } = useUserContext();

    const cookies = new Cookies();

    const addUser = (user: User) => {
        cookies.set("user", user, { path: "/",
        secure: true,
        sameSite: "strict"

    });
        updateUser(user);
        console.log("User added");
    }

    const removeUser = () => {
        cookies.remove("user");
        updateUser(null);
        console.log("User removed");
    }
    const getUser = (): User | undefined  => {
        return cookies.get("user");
    }

    return {
        addUser,
        removeUser,
        getUser
    }
}