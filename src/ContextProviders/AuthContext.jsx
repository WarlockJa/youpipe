import React, { useContext, useState } from 'react';

const AuthContext = React.createContext()
const AuthUpdateContext = React.createContext()

export function useAuthData() {
    return useContext(AuthContext)
}

export function useAuthUpdateData() {
    return useContext(AuthUpdateContext)
}

export default function AuthProvider({ children }) {
    const [userData, setUserData] = useState(null)

    function ChangeUser(newUserData) {
        setUserData(newUserData)
    }

    return (
        <AuthContext.Provider value={userData}>
            <AuthUpdateContext.Provider value={ChangeUser}>
                {children}
            </AuthUpdateContext.Provider>
        </AuthContext.Provider>
    )
}
