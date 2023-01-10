import './videoarea.scss'
import Icons from '../../Assets/icons'
import { useVideo, useVideoUpdate } from '../../ContextProviders/VideoContext'
import { useQuery, useQueryUpdate } from '../../ContextProviders/QueryProvider'
import CommentsArea from './CommentsArea'

export default function VideoArea() {
    // video context
    const video = useVideo()
    const ChangeVideo = useVideoUpdate()
    // query context
    const query = useQuery()
    const ChangeQuery = useQueryUpdate()
    
    // handling click on user icon or channel name
    const goToVideoAuthorsPage = () => {
        ChangeVideo({ ...video.defaults, defaults: video.defaults })
        ChangeQuery({
            amountToFind: query.defaults.amountToFind,
            fieldToSortBy: query.defaults.fieldToSortBy,
            query: { type: "author", field: video.element.author },
            defaults: query.defaults
        })
    }

    return (
        <div
            className="videoArea-container"
            videomode={video.active ? '1' : '0'}
        >
            {video.active &&
            <>
                <form className="videoArea-videoContainer">
                    <img className='videoArea-video' src={video.element.image} alt="" />
                    <div className="videoArea-videoTitle">{video.element.title}</div>
                    <div className="videoArea-channelInfo">
                        <div
                            className="videoArea-channelInfo-avatar"
                            onClick={() => goToVideoAuthorsPage()}
                        >
                            <img src={video.element.avatar} alt="" />
                        </div>
                        <div className="videoArea-channelInfo-secondSection">
                            <p
                                className='videoArea-channelInfo-secondSection-channelName'
                                onClick={() => goToVideoAuthorsPage()}
                            >{video.element.author}</p>
                            <p>Subscrbers Number Plug</p>
                        </div>
                        <div className="videoArea-channelInfo-subscribeButton videoArea-button">Subscribe</div>

                        <div className="videoArea-ratingSection">
                            <div
                                className="videoArea-ratingSection-likes videoArea-button"
                                title='I like this'
                            >
                                <Icons.ThumbUp />
                                {video.element.rating.likes}
                            </div>
                            <div className="videoArea-ratingSection-divider">
                                <div className="videoArea-ratingSection-divider-line"></div>
                            </div>
                            <div
                                className="videoArea-ratingSection-dislikes videoArea-button"
                                title={video.element.rating.dislikes + ' ;)'}
                            >
                                <Icons.ThumbUp style={{transform: 'rotateZ(180deg)'}}/>
                            </div>
                        </div>
                    </div>
                    <div className="videoArea-description">{video.element.description}</div>
                </form>
                <CommentsArea />
            </>}
        </div>
    )
}
