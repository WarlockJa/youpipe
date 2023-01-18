import './sidemenu.scss'
import Icons from '../../Assets/icons'
import { useSideMenu, useSideMenuUpdate } from '../../ContextProviders/SideMenuContext'
import { useQuery, useQueryUpdate } from '../../ContextProviders/QueryContext'
import { useVideo, useVideoUpdate } from '../../ContextProviders/VideoContext'
import { useAuthData } from '../../ContextProviders/AuthContext'
import { useTheme } from '../../ContextProviders/ThemeContext'
import NoUserAnimationPlug from '../../Utils/NoUserAnimationPlug'
import { useState } from 'react'

export default function SideMenu() {
    // theme context
    const darkTheme = useTheme()
    // side menu active element context
    const sideMenuOptions = useSideMenu()
    const ChangeSideMenu = useSideMenuUpdate()
    // query context
    const query = useQuery()
    const ChangeQuery = useQueryUpdate()
    // video context
    const video = useVideo()
    const ChangeVideo = useVideoUpdate()
    // auth context
    const userData = useAuthData()
    // no user notification trigger state
    const [noUserTrigger, setNoUserTrigger] = useState(false)


    // handle side menu item click
    const handleClick = (props) => {
        const { elementIndex, query, URI } = props
        window.history.pushState(URI.field1, "", process.env.REACT_APP_YOUPIPE_URI + URI.field3)
        ChangeSideMenu({ ...sideMenuOptions, activeElementIndex: elementIndex })
        ChangeQuery(query)
        ChangeVideo({ ...video.defaults, defaults: video.defaults })
    }
    
    return (
        <div
            className={video.active
                ? sideMenuOptions.sideMenuFolded ? "sidemenu videoModeHidden expanded" : "sidemenu videoModeCover expanded"
                : sideMenuOptions.sideMenuFolded ? "sidemenu folded" : "sidemenu expanded"}
            darktheme={darkTheme ? 1 : 0}
        >
            <div className="sideMenu-section">
                <div
                    className="sideMenu-section-item"
                    onClick={() => handleClick({
                        elementIndex: 0,
                        query:{
                            amountToFind: query.defaults.amountToFind,
                            fieldToSortBy: query.defaults.fieldToSortBy,
                            query: query.defaults.query,
                            defaults: query.defaults
                        },
                        URI: {
                            field1: "Home",
                            field3: ""
                        }
                    })}
                >
                    {sideMenuOptions.activeElementIndex === 0 ? <Icons.HomeActive /> : <Icons.Home />}
                    <p>Home</p>
                </div>
            </div>
            <div className="sideMenu-section">
                <div
                    className="sideMenu-section-item"
                    onClick={() => handleClick({
                        elementIndex: 1,
                        query: {
                            amountToFind: query.defaults.amountToFind,
                            fieldToSortBy: query.defaults.fieldToSortBy,
                            query: { type: "tags", field: ['Shorts'] },
                            defaults: query.defaults
                        },
                        URI: {
                            field1: "tags",
                            field3: "?tags=Shorts"
                        }
                    })}
                >
                    {sideMenuOptions.activeElementIndex === 1 ? <Icons.ShortsActive /> : <Icons.Shorts />}
                    <p>Shorts</p>
                </div>
            </div>
            <div className="sideMenu-section">
                <div
                    className="sideMenu-section-item"
                    onClick={() => userData
                        ? handleClick({
                            elementIndex: 2,
                            query: {
                                amountToFind: query.defaults.amountToFind,
                                fieldToSortBy: query.defaults.fieldToSortBy,
                                query: { type: "author", field: userData.activity.subscriptions },
                                defaults: query.defaults
                            },
                            URI: {
                                field1: "subs",
                                field3: "?subs=all"
                            }
                        })
                        : setNoUserTrigger(prev => !prev)
                    }
                >
                    {sideMenuOptions.activeElementIndex === 2 ? <Icons.SubscriptionsActive /> : <Icons.Subscriptions />}
                    <p>Subscriptions</p>
                </div>
            </div>
            <div className="sideMenu-section">
                <div
                    className="sideMenu-section-item"
                    onClick={() => userData
                        ? handleClick({
                            elementIndex: 3,
                            query: {
                                amountToFind: query.defaults.amountToFind,
                                fieldToSortBy: query.defaults.fieldToSortBy,
                                query: { type: "liked", field: userData.activity.likes },
                                defaults: query.defaults
                            },
                            URI: {
                                field1: "liked",
                                field3: "?liked=all"
                            }
                        })
                        : setNoUserTrigger(prev => !prev)
                    }
                >
                    {sideMenuOptions.activeElementIndex === 3 ? <Icons.LibraryActive /> : <Icons.Library />}
                    <p>Liked videos</p>
                </div>
            </div>
            {!userData && <NoUserAnimationPlug trigger={noUserTrigger ? 1 : 0} />}
        </div>
    )
}
