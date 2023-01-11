import './videotile.scss'
import StumpImage from "../../../Assets/stumpimage.png"
import { useVideo, useVideoUpdate } from '../../../ContextProviders/VideoContext'
import { useSideMenu, useSideMenuUpdate } from '../../../ContextProviders/SideMenuContext'
import { RefreshToken } from '../../../Utils/API/RequestsLibrary'
import { useAuthUpdateData } from '../../../ContextProviders/AuthContext'

export default function VideoTile(props) {
    const { element } = props
    // video context
    const video = useVideo()
    const ChangeVideo = useVideoUpdate()
    // side menu context
    const sideMenuOptions = useSideMenu()
    const ChangeSideMenu = useSideMenuUpdate()
    // auth context
    const ChangeUser = useAuthUpdateData()

    // returning stump tile to fill up unfinished row
    if(!element) return (
        <div className="video-tile video-tile-stump">
            <div className="ImageArea">
                <img src={StumpImage} alt="" />
            </div>
        </div>
    )
    
    const { author, avatar, image, title, uploaded, views } = element
    // TODO: time parser
    const dateFormat = new Intl.DateTimeFormat("en-GB", {day: '2-digit', hour: '2-digit', minute: '2-digit'})

    const handleVideoTileClick = () => {
        RefreshToken(ChangeUser)
        ChangeVideo({ active: true, element: element, amountToFind: 40, defaults: video.defaults })
        ChangeSideMenu({ ...sideMenuOptions, sideMenuFolded: true })
    }

    return (
        <div
            className="video-tile"
            onClick={()=> handleVideoTileClick()}
        >
            <div className="ImageArea">
                <img src={image} alt="" />
                <div className='Overlays'>
                    <div className="WatchLater"></div>
                    <div className="AddToQueue"></div>
                    <div className="VideoDuration"></div>
                </div>
            </div>
            <div className="VideoDescription">
                <div className="UserIcon">
                    <img src={avatar} alt="" />
                </div>
                <div className="Description">
                    <h2 title={title}>{title}</h2>
                    <h3>{author}</h3>
                    <h3>{views} • {dateFormat.format(Date.now() - Date.parse(uploaded))} ago</h3>
                </div>
                <div className="VideoOptions">
                    <div className="dots"></div>
                    <div className="dots"></div>
                    <div className="dots"></div>
                </div>
            </div>
        </div>
    )
}
