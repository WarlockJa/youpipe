import { useCallback, useRef } from 'react'
import useEventOutsideListener from '../../../../Utils/useEventOutsideListener'
import '../../../../Utils/menu.scss'
import { useTheme, useThemeUpdate } from '../../../../ContextProviders/ThemeContext'
import { useAuthData, useAuthUpdateData } from '../../../../ContextProviders/AuthContext'
import { useMenuData, useMenuUpdateData } from '../../../../ContextProviders/MenuContext'
import { logout, updateUserData } from '../../../../Utils/API/RequestsLibrary'
import { useQuery, useQueryUpdate } from '../../../../ContextProviders/QueryContext'

export default function UserMenu(props) {
    const { iconMenuRef } = props
    // theme context
    const darkTheme = useTheme()
    const ChangeTheme = useThemeUpdate()
    // authorized user context
    const userData = useAuthData()
    const ChangeUser = useAuthUpdateData()
    // menus context
    const menuData = useMenuData()
    const ChangeMenu = useMenuUpdateData()
    const userMenuRef = useRef(null)
    // videos context
    const query = useQuery()
    const ChangeQuery = useQueryUpdate()

    // closing user menu if clicked outside of it's area using custom hook
    const handleClickOutside = useCallback((event) => {
        if (menuData.userMenu === false) { return } // menu already closed
        if (userMenuRef.current.contains(event.target)) { return } // clicking inside the menu area
        if (iconMenuRef.current.contains(event.target)) { return } // clicking on the icon that would close the menu instead
        if (!userMenuRef.current) { return } // no menu reference

        ChangeMenu({...menuData, userMenu: false}) // closing the menu
    }, [menuData.userMenu])

    useEventOutsideListener('mousedown', handleClickOutside, document)

    // handling your channel menu option click
    const handleYourChannelClick = () => {
        ChangeMenu({...menuData, userMenu: !menuData.userMenu })
        ChangeQuery({
            amountToFind: query.defaults.amountToFind,
            fieldToSortBy: query.defaults.fieldToSortBy,
            query: { type: "author", field: userData.name },
            defaults: query.defaults
        })
    }

    return (
        <div
            className="menu"
            visible={menuData.userMenu ? 1 : 0}
            ref={userMenuRef}
        >
            <div className="userInfo">
                <img 
                    src={userData.avatar}
                    alt=""
                    title='Change avatar'
                    onClick={() => ChangeMenu({...menuData, userMenu: !menuData.userMenu, avatarMenu: !menuData.avatarMenu })}
                />
                <p className='userInfo-fullName' title={userData.fullname} >{userData.fullname}</p>
                <p className='userInfo-name' title={'@' + userData.name} >@{userData.name}</p>
            </div>
            <div
                className='menu-item'
                onClick= {() => handleYourChannelClick()}
            >Your channel</div>
            <div
                className='menu-item'
                title='Switch user'
                onClick={() => ChangeMenu({...menuData, userMenu: !menuData.userMenu, userSwitchMenu: !menuData.userSwitchMenu })}
            >Switch account</div>
            <div
                className='menu-item'
                onClick={() => {
                    updateUserData({ AccessToken: userData.accessToken, UpdateFields: { "darktheme": !darkTheme }, ChangeUser: ChangeUser})
                    ChangeTheme((prev => !prev))
                }}
            >Appearance: {darkTheme ? 'Dark' : 'Light'}</div>
            <div className='menu-item'>Send feedback</div>
            <div className='menu-item' onClick={logout}>Sign out</div>
        </div>
    )
}