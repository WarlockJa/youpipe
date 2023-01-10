import "./headermenu.scss"
import Icon from "../../Assets/tubes.png"
import { useTheme } from "../../ContextProviders/ThemeContext"
import { useAuthUpdateData } from "../../ContextProviders/AuthContext"
import { useAuthData } from "../../ContextProviders/AuthContext"
import Icons from '../../Assets/icons'
import { useEffect, useState } from "react"
import { refreshTokenRequest, getIdTokenRequest } from "../../Utils/API/RequestsLibrary"
import UserLogged from "./Right/UserLogged/UserLogged"
import Login from "./Right/Login/Login"
import MenuProvider from "../../ContextProviders/MenuContext"
import useLoadingHook from "../../Utils/API/useLoadingHook"
import LoadingPlug from "../../Utils/LoadingPlug"
import { useQuery, useQueryUpdate } from "../../ContextProviders/QueryProvider"
import { useSideMenu, useSideMenuUpdate } from "../../ContextProviders/SideMenuContext"
import { useVideo, useVideoUpdate } from "../../ContextProviders/VideoContext"

export default function HeaderMenu() {
  // theme context
  const darkTheme = useTheme() ? ' dark' : ''
  // user data context
  const userData = useAuthData()
  const ChangeUser = useAuthUpdateData()
  // query context
  const query = useQuery()
  const ChangeQuery = useQueryUpdate()
  // side menu context
  const sideMenuOptions = useSideMenu()
  const ChangeSideMenu = useSideMenuUpdate()
  // video context
  const video = useVideo()
  const ChangeVideo = useVideoUpdate()
  // search bar value for search queries
  const [searchInput, setSearchInput] = useState('')

  // callback for fetched Access Token, using it to make an authorized request to fetch Id Token
  const callbackGetAccessToken = (AccessToken) => {
    ChangeUser(() => (AccessToken))
    getIdToken.apiRequest(getIdTokenRequest(AccessToken.accessToken))
  }

  // callback for Id Token fetching
  const callbackGetIdToken = (IdToken) => {
    ChangeUser((prev) => ({ ...prev, ...IdToken }))
  }

  // using loading hook to display loading screen on user data fecth during first loading
  const getAccessToken = useLoadingHook({ callback: callbackGetAccessToken })
  const getIdToken = useLoadingHook({ callback: callbackGetIdToken })

  // on site load check if Refresh Token present and use it to fetch data
  useEffect (() => {

    console.log('Fetching user data from refresh Token useEffect firing')
    getAccessToken.apiRequest(refreshTokenRequest)
  },[])

  // executing search
  const handleSearchClick = (searchString) => {
    if(searchString) {
      ChangeVideo({ ...video.defaults, defaults: video.defaults })
      ChangeQuery({
        amountToFind: query.defaults.amountToFind,
        fieldToSortBy: "rating.likes",
        query: { type: "search", field: searchString },
        defaults: query.defaults
      })
    }
  }

  // catching enter pressed as search submit event
  const handleSearchbarKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchClick(searchInput)
  }
  
  return (
    <div className={"headerMenu" + darkTheme}>
      <div className="headerMenu-left">
        <div className="headerMenu-left-sidemenuButton" onClick={() => ChangeSideMenu({ ...sideMenuOptions, sideMenuFolded: !sideMenuOptions.sideMenuFolded })}>
          <div className="buttonLine" id="line1"></div>
          <div className="buttonLine" id="line2"></div>
          <div className="buttonLine" id="line3"></div>
        </div>
        <div
          className="headerMenu-left-logo"
          title="YouPipe Home"
          onClick={() => window.location.replace(process.env.REACT_APP_YOUPIPE_URI)} // url of the youpipe
        >
          <img src={Icon} alt="" />
          YouPipe
        </div>
      </div>

      <div className="headerMenu-center">
        <div className="headerMenu-searchBar">
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => handleSearchbarKeyDown(e)}
          />
          <div
            className="searchButton"
            onClick={() => handleSearchClick(searchInput)}
          ><Icons.Loupe /></div>
        </div>
      </div>

      <div className={"headerMenu-right"}>
        <MenuProvider>
          { 
            getAccessToken.isLoading || (!getAccessToken.isError && getIdToken.isLoading) ? <LoadingPlug /> :
              userData ? <UserLogged /> : <Login />
          }
        </MenuProvider>
      </div>
    </div>
  )
}
