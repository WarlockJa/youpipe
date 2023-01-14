import { useCallback, useRef } from 'react'
import useEventOutsideListener from '../../../../Utils/useEventOutsideListener'
import { useAuthData } from '../../../../ContextProviders/AuthContext'
import { useMenuData, useMenuUpdateData } from '../../../../ContextProviders/MenuContext'
import AvatarsData from './avatars.json'
import { updateUserData } from '../../../../Utils/API/RequestsLibrary'

export default function AvatarMenu(props) {
    const { iconMenuRef } = props
    // auth context
    const userData = useAuthData()
    // menu context
    const menuData = useMenuData()
    const ChangeMenu = useMenuUpdateData()

    const avatarMenuRef = useRef(null)

    // closing user menu if clicked outside of it's area using custom hook
    const handleClickOutside = useCallback((event) => {
        if (menuData.avatarMenu === false) { return } // menu already closed
        if (avatarMenuRef.current.contains(event.target)) { return } // clicking inside the menu area
        if (iconMenuRef.current.contains(event.target)) { return } // clicking on the icon that would close the menu instead
        if (!avatarMenuRef.current) { return } // no menu reference

        ChangeMenu({...menuData, avatarMenu: false}) // closing the menu
    }, [menuData.avatarMenu])

    useEventOutsideListener('mousedown', handleClickOutside, document)

    const handleAvatarUpdate = (props) => {
        const { AccessToken, UpdateFields } = props
        updateUserData({ AccessToken: AccessToken, UpdateFields: UpdateFields })
        window.location.reload()
    }

    const AvatarsList = (items) => {
        return items.items.map((item, index) => {
            return(
                <div
                    key={index}
                    className="avatar"
                    onClick={() => handleAvatarUpdate({ AccessToken: userData.accessToken, UpdateFields: { "avatar": item.avatar } })}
                >
                    <img src={item.avatar} alt="" />
                </div>
            )
        })
    }

    return (
        <div
            className="menu avatars-grid"
            visible={menuData.avatarMenu ? 1 : 0}
            ref={avatarMenuRef}
        >
            <div className="menu-return">
                <div
                    className="menu-return-arrow"
                    onClick={() => ChangeMenu({...menuData, userMenu: !menuData.userMenu, avatarMenu: !menuData.avatarMenu })}
                >
                    <div className="arrow-part1"></div>
                    <div className="arrow-part2"></div>
                    <div className="arrow-part3"></div>
                </div>
                <p>Choose avatar</p>
            </div>
            <div className="images-grid">
                <AvatarsList items={AvatarsData.items} />
            </div>
        </div>
    )
}