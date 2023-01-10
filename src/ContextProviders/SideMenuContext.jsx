import React, { useContext, useState } from 'react'

const SideMenuContext = React.createContext()
const SideMenuUpdateContext = React.createContext({ sideMenuFolded: true, activeElementIndex: 0 })

export function useSideMenu() {
    return useContext(SideMenuContext)
}

export function useSideMenuUpdate() {
    return useContext(SideMenuUpdateContext)
}

export default function SideMenuProvider({ children }) {
    const [sideMenuOptions, setSideMenuOptions] = useState({ sideMenuFolded: true, activeElementIndex: 0 })

    function ChangeSideMenu(newSideMenuOptions) {
        setSideMenuOptions(() => newSideMenuOptions)
    }

    return (
        <SideMenuContext.Provider value={sideMenuOptions}>
            <SideMenuUpdateContext.Provider value={ChangeSideMenu}>
                {children}
            </SideMenuUpdateContext.Provider>
        </SideMenuContext.Provider>
    )
}
