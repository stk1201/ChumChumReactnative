// context/UserContext.js
import React, { createContext, useState, ReactNode} from 'react';

interface User {
    userId: number;
    emailAddress: string;
}

interface UserContext {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserStocker = createContext<UserContext | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    return(
        <UserStocker.Provider value={{ user, setUser}}>
            {children}
        </UserStocker.Provider>
    );
};
