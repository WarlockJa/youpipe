import React, { useContext, useState } from 'react';

const MenuContext = React.createContext({ userMenu: false, sendFeedback: false, avatarMenu: false, noUserMenu: false, loginMenu: false, userSwitchMenu: false, createVideoMenu: false })
const MenuUpdateContext = React.createContext()

export function useMenuData() {
    return useContext(MenuContext)
}

export function useMenuUpdateData() {
    return useContext(MenuUpdateContext)
}

export default function MenuProvider({ children }) {
    const [menuData, setMenuData] = useState({ userMenu: false, sendFeedback: false, avatarMenu: false, noUserMenu: false, loginMenu: false, userSwitchMenu: false, createVideoMenu: false })

    function ChangeMenu(newMenuData) {
        setMenuData(newMenuData)
    }

    return (
        <MenuContext.Provider value={menuData}>
            <MenuUpdateContext.Provider value={ChangeMenu}>
                {children}
            </MenuUpdateContext.Provider>
        </MenuContext.Provider>
    )
}
