import './videotile.scss'
import StumpImage from "../../../Assets/stumpimage.png"
import { useVideo, useVideoUpdate } from '../../../ContextProviders/VideoContext'
import { useSideMenu, useSideMenuUpdate } from '../../../ContextProviders/SideMenuContext'
import { RefreshToken } from '../../../Utils/API/RequestsLibrary'
import { useAuthUpdateData } from '../../../ContextProviders/AuthContext'
import { useQuery, useQueryUpdate } from '../../../ContextProviders/QueryContext'
import TimeParser from '../../../Utils/TimeParser'

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
    // query context
    const query = useQuery()
    const ChangeQuery = useQueryUpdate()

    // returning stump tile to fill up unfinished row
    if(!element) return (
        <div className="video-tile video-tile-stump">
            <div className="ImageArea">
                <img src={StumpImage} alt="" />
            </div>
        </div>
    )
    
    // passed video slide information
    const { author, avatar, image, title, uploaded, views, _id } = element

    const handleVideoTileClick = () => {
        // changing URI for the video
        window.history.pushState("video", "", process.env.REACT_APP_YOUPIPE_URI + "?v=" + encodeURI(_id))
        // refreshing Access Token for the user
        RefreshToken(ChangeUser)
        // Switching to another slide
        ChangeVideo({ active: true, element: element, amountToFind: 40, defaults: video.defaults })
        // Folding side menu for video mode
        ChangeSideMenu({ ...sideMenuOptions, sideMenuFolded: true })
        // changing query for the main area based on the tags of the selected slide
        let randomTagsArray = [];
        // selecting a random N=1 number of tags from the list
        [...Array(1)].map(_item => randomTagsArray.push(element.tags[ Math.floor(Math.random() * element.tags.length) ]))
        // making the request array unique
        // randomTagsArray = [...new Set(randomTagsArray.map(item => item))]
        ChangeQuery({
            amountToFind: query.defaults.amountToFind,
            fieldToSortBy: query.defaults.fieldToSortBy,
            query: { type: "tags", field: randomTagsArray },
            defaults: query.defaults
        })
    }

    return (
        <div
            className="video-tile"
            onClick={()=> handleVideoTileClick()}
        >
            <div className="ImageArea">
                <img src={image} alt="" />
            </div>
            <div className="VideoDescription">
                <div className="UserIcon">
                    <img src={avatar} alt="" />
                </div>
                <div className="Description">
                    <h2 title={title}>{title}</h2>
                    <h3>{author}</h3>
                    <h3>{views} • {TimeParser(uploaded)}</h3>
                </div>
            </div>
        </div>
    )
}
