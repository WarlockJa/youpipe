import { useCallback, useRef } from 'react'
import useEventOutsideListener from '../../../../Utils/useEventOutsideListener'
import '../../../../Utils/menu.scss'
import { useTheme, useThemeUpdate } from '../../../../ContextProviders/ThemeContext'
import { useMenuData, useMenuUpdateData } from '../../../../ContextProviders/MenuContext'

export default function NoUserOptions(props) {
    const { iconRef } = props
    // theme context
    const darkTheme = useTheme()
    const ToggleTheme = useThemeUpdate()
    // menu context
    const menuData = useMenuData()
    const ChangeMenu = useMenuUpdateData()
    const noUserMenuRef = useRef(null)

    // closing user menu if clicked outside of it's area using custom hook
    const handleClickOutside = useCallback((event) => {
        if (menuData.noUserMenu === false) { return } // menu already closed
        if (noUserMenuRef.current.contains(event.target)) { return } // clicking inside the menu area
        if (iconRef.current.contains(event.target)) { return } // clicking on the icon that would close the menu instead
        if (!noUserMenuRef.current) { return } // no menu reference

        ChangeMenu({...menuData, noUserMenu: false}) // closing the menu
    }, [menuData.noUserMenu])

    useEventOutsideListener('mousedown', handleClickOutside)

    return (
        <div
            className="menu"
            visible={menuData.noUserMenu ? 1 : 0}
            ref={noUserMenuRef}
        >
            <div
                className='menu-item'
                onClick={ToggleTheme}
            >Appearance: {darkTheme ? 'Dark' : 'Light'}</div>
            <div className='menu-item'>Send feedback</div>
        </div>
    )
}
