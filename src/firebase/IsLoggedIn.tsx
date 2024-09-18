import React, { useEffect, useState } from 'react';
import { authKey } from './FirebaseKey';
import { onAuthStateChanged, User } from 'firebase/auth';

const IsLoggedIn = (): [User | null, React.Dispatch<React.SetStateAction<User | null>>] => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(authKey, (userCred) => {
            if (userCred?.emailVerified) {
                setUser(userCred); // Set the user or null
            } else {
                setUser(null)
            }
        });

        return () => unsub(); // Cleanup subscription on component unmount
    }, [user]);

    return [user, setUser];
}

export default IsLoggedIn;