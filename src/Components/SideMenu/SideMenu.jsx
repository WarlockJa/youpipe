import './sidemenu.scss'
import Home from '../../Assets/home.png'
import HomeActive from '../../Assets/homeactive.png'
import Shorts from '../../Assets/shorts.png'
import ShortsActive from '../../Assets/shortsactive.png'
import Subscriptions from '../../Assets/subscriptions.png'
import SubscriptionsActive from '../../Assets/subscriptionsactive.png'
import Library from '../../Assets/library.png'
import LibraryActive from '../../Assets/libraryactive.png'
import { useSideMenu, useSideMenuUpdate } from '../../ContextProviders/SideMenuContext'
import { useQuery, useQueryUpdate } from '../../ContextProviders/QueryProvider'
import { useVideo, useVideoUpdate } from '../../ContextProviders/VideoContext'

export default function SideMenu() {
    // side menu active element context
    const sideMenuOptions = useSideMenu()
    const ChangeSideMenu = useSideMenuUpdate()
    // query context
    const query = useQuery()
    const ChangeQuery = useQueryUpdate()
    // video context
    const video = useVideo()
    const ChangeVideo = useVideoUpdate()

    const handleClick = (elementIndex, query) => {
        ChangeSideMenu({ ...sideMenuOptions, activeElementIndex: elementIndex })
        ChangeQuery(query)
        ChangeVideo({ ...video.defaults, defaults: video.defaults })
    }
    
    return (
        <div className={video.active
            ? sideMenuOptions.sideMenuFolded ? "sidemenu videoModeHidden expanded" : "sidemenu videoModeCover expanded"
            : sideMenuOptions.sideMenuFolded ? "sidemenu folded" : "sidemenu expanded"}>
            <div className="sideMenu-section">
                <div
                    className="sideMenu-section-item"
                    onClick={() => handleClick(0,
                        {
                            amountToFind: query.defaults.amountToFind,
                            fieldToSortBy: query.defaults.fieldToSortBy,
                            query: query.defaults.query,
                            defaults: query.defaults
                        })
                    }
                >
                    <img src={sideMenuOptions.activeElementIndex === 0 ? HomeActive : Home} alt="" />
                    <p>Home</p>
                </div>
            </div>
            <div className="sideMenu-section">
                <div
                    className="sideMenu-section-item"
                    onClick={() => handleClick(1,
                        {
                            amountToFind: query.defaults.amountToFind,
                            fieldToSortBy: query.defaults.fieldToSortBy,
                            query: { type: "tags", field: ['Shorts'] },
                            defaults: query.defaults
                        })
                    }
                >
                    <img src={sideMenuOptions.activeElementIndex === 1 ? ShortsActive : Shorts} alt="" />
                    <p>Shorts</p>
                </div>
            </div>
            <div className="sideMenu-section">
                <div className="sideMenu-section-item">
                    <img src={sideMenuOptions.activeElementIndex === 2 ? SubscriptionsActive : Subscriptions} alt="" />
                    <p>Subscriptions</p>
                </div>
            </div>
            <div className="sideMenu-section">
                <div className="sideMenu-section-item">
                    <img src={sideMenuOptions.activeElementIndex === 3 ? LibraryActive : Library} alt="" />
                    <p>Library</p>
                </div>
            </div>
        </div>
    )
}
