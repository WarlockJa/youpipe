import { useCallback, useRef } from 'react'
import useEventOutsideListener from '../../../../Utils/useEventOutsideListener'
import '../../../../Utils/menu.scss'
import { useAuthUpdateData } from "../../../../ContextProviders/AuthContext"
import { useMenuData, useMenuUpdateData } from '../../../../ContextProviders/MenuContext'
import FetchUsersList from '../../../../Utils/API/FetchUsersList'

export default function LoginOptions(props) {
    const { iconRef } = props
    const menuData = useMenuData()
    const ChangeMenu = useMenuUpdateData()
    const ChangeUser = useAuthUpdateData();
    const loginMenuRef = useRef(null)

    // closing user menu if clicked outside of it's area using custom hook
    const handleClickOutside = useCallback((event) => {
        if (menuData.loginMenu === false) { return } // menu already closed
        if (loginMenuRef.current.contains(event.target)) { return } // clicking inside the menu area
        if (iconRef.current.contains(event.target)) { return } // clicking on the icon that would close the menu instead
        if (!loginMenuRef.current) { return } // no menu reference

        ChangeMenu({...menuData, loginMenu: false}) // closing the menu
    }, [menuData.loginMenu])

    useEventOutsideListener('mousedown', handleClickOutside)
    
    return (
        <div
            className="menu"
            visible={menuData.loginMenu ? 1 : 0}
            ref={loginMenuRef}
        >
            <FetchUsersList
                menuItem={menuData.loginMenu}
                ChangeUser={ChangeUser}
            />
        </div>
    )
}