import Icons from '../../../../Assets/icons'
import UserMenu from './UserMenu'
import AvatarMenu from './AvatarMenu'
import UserSwitchMenu from './UserSwitchMenu'
import CreateVideo from './CreateVideo/CreateVideo'
import DefaultUserIcon from '../../../../Assets/defaultIcon.png'
import { useRef } from 'react'
import { useAuthData } from "../../../../ContextProviders/AuthContext"
import { useMenuData, useMenuUpdateData } from '../../../../ContextProviders/MenuContext'
import MenuSwitch from '../../../../Utils/MenuSwitch'

export default function UserLogged() {
  const userMenuRef = useRef(null)
  const cameraMenuRef = useRef(null)
  const userData = useAuthData()
  const menuData = useMenuData()
  const ChangeMenu = useMenuUpdateData()

  const testFunc = () => {
    console.log('UserData: ', userData)
  }

  return (
    <div className="headerMenu-right-icons">
      <div
        className="headerMenu-right-icon"
        title='Create a video'
        ref={cameraMenuRef}
        onClick={() => MenuSwitch({ menuList: menuData, menuItem: 'createVideoMenu', menuFunc: ChangeMenu })}
      >
        <Icons.Camera />
      </div>
      <CreateVideo 
        iconMenuRef={cameraMenuRef}
      />
      <div className="headerMenu-right-icon" title='Notifications' onClick={testFunc}>
        <Icons.Bell />
      </div>
      <img
        className="headerMenu-right-icon"
        src={userData ? userData.avatar : DefaultUserIcon}
        alt="Avatar"
        ref={userMenuRef}
        onClick={() => MenuSwitch({ menuList: menuData, menuItem: 'userMenu', menuFunc: ChangeMenu })}
      />
      <UserMenu
        iconMenuRef={userMenuRef}
        />
      <AvatarMenu
        iconMenuRef={userMenuRef}
      />
      <UserSwitchMenu 
        iconMenuRef={userMenuRef}
      />
    </div>
  )
}
