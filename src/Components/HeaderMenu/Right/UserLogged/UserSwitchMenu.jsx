import { useCallback, useRef } from 'react'
import useEventOutsideListener from '../../../../Utils/useEventOutsideListener'
import '../../../../Utils/menu.scss'
import { useAuthUpdateData } from '../../../../ContextProviders/AuthContext'
import { useMenuData, useMenuUpdateData } from '../../../../ContextProviders/MenuContext'
import FetchUsersList from '../../../../Utils/API/FetchUsersList'

export default function UserSwitchMenu(props) {
    const { iconMenuRef } = props
    const ChangeUser = useAuthUpdateData()
    const menuData = useMenuData()
    const ChangeMenu = useMenuUpdateData()
    const switchMenuRef = useRef(null)

    // closing user menu if clicked outside of it's area using custom hook
    const handleClickOutside = useCallback((event) => {
        if (menuData.userSwitchMenu === false) { return } // menu already closed
        if (switchMenuRef.current.contains(event.target)) { return } // clicking inside the menu area
        if (iconMenuRef.current.contains(event.target)) { return } // clicking on the icon that would close the menu instead
        if (!switchMenuRef.current) { return } // no menu reference

        ChangeMenu({...menuData, userSwitchMenu: false}) // closing the menu
    }, [menuData.userSwitchMenu])

    useEventOutsideListener('mousedown', handleClickOutside)

    return (
        <div
            className="menu"
            visible={menuData.userSwitchMenu ? 1 : 0}
            ref={switchMenuRef}
        >
            <div className="menu-return">
                <div
                    className="menu-return-arrow"
                    onClick={() => ChangeMenu({...menuData, userMenu: !menuData.userMenu, userSwitchMenu: !menuData.userSwitchMenu })}
                >
                    <div className="arrow-part1"></div>
                    <div className="arrow-part2"></div>
                    <div className="arrow-part3"></div>
                </div>
                <p>Switch account</p>
            </div>
            <FetchUsersList
                menuItem={menuData.userSwitchMenu}
                ChangeUser={ChangeUser}
            />
        </div>
    )
}