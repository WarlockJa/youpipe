import NoUserOptions from './NoUserOptions'
import LoginOptions from './LoginOptions'
import { useRef } from 'react'
import Icons from '../../../../Assets/icons'
import MenuSwitch from '../../../../Utils/MenuSwitch'
import { useMenuData, useMenuUpdateData } from '../../../../ContextProviders/MenuContext'

export default function Login() {
  const menuData = useMenuData()
  const ChangeMenu = useMenuUpdateData()
  const noUserOptionsMenuRef = useRef(null)
  const loginOptionsMenuRef = useRef(null)

  return (
    <div className="headerMenu-right-icons">
      <div
        className="headerMenu-right-icon"
        ref={noUserOptionsMenuRef}
        onClick={() => MenuSwitch({ menuList: menuData, menuItem: 'noUserMenu', menuFunc: ChangeMenu })}
      >
        <div className="headerMenu-right-icon-dots">
          <div className="headerMenu-right-icon-dot"></div>
          <div className="headerMenu-right-icon-dot"></div>
          <div className="headerMenu-right-icon-dot"></div>
        </div>
      </div>
      <NoUserOptions 
        iconRef={noUserOptionsMenuRef}
      />
      <div
        className="headerMenu-right-icon-login"
        ref={loginOptionsMenuRef}
        onClick={() => MenuSwitch({ menuList: menuData, menuItem: 'loginMenu', menuFunc: ChangeMenu })}
      >
        <Icons.Person />
        <p>Login</p>
      </div>
      <LoginOptions
        iconRef={loginOptionsMenuRef}
      />
    </div>
  )
}
