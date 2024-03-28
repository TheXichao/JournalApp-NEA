import { useContext} from "react";
import { UserContext, UserContextType  } from "../context/userContext";

export default function useUserContext() {
    const context = useContext(UserContext) as UserContextType;

    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;

}