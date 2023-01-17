import NoUserOptions from './NoUserOptions'
import LoginOptions from './LoginOptions'
import SendFeedback from '../../SendFeedback'
import { useRef } from 'react'
import Icons from '../../../../Assets/icons'
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
        onClick={() => ChangeMenu({ ...menuData, noUserMenu: true })}
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
        onClick={() => ChangeMenu({ ...menuData, loginMenu: true })}
      >
        <Icons.Person />
        <p>Login</p>
      </div>
      <SendFeedback
        iconMenuRef={loginOptionsMenuRef}
        noUser={true}
      />
      <LoginOptions
        iconRef={loginOptionsMenuRef}
      />
    </div>
  )
}
