import './videoarea.scss'
import Icons from '../../Assets/icons'
import { useVideo, useVideoUpdate } from '../../ContextProviders/VideoContext'
import { useQuery, useQueryUpdate } from '../../ContextProviders/QueryProvider'
import CommentsArea from './CommentsArea'
import { useRef, useEffect } from 'react'
import { useAuthData } from '../../ContextProviders/AuthContext'
import { updateUserData } from '../../Utils/API/RequestsLibrary'

export default function VideoArea() {
    // auth context
    const userData = useAuthData()
    // video context
    const video = useVideo()
    const ChangeVideo = useVideoUpdate()
    // query context
    const query = useQuery()
    const ChangeQuery = useQueryUpdate()
    const videoAreaRef = useRef()
    
    useEffect(() => {
        // scrolling to the top of the vide area page on new slide select
        if(videoAreaRef.current) {
            videoAreaRef.current.scrollIntoView()
        }
    },[video.element.title])

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

    const handleLikePress = () => {
        // const newLikesArray = userData.activity.likes.includes(video.element._id)
        //     ? userData.activity.likes.filter(item => item === video.element._id)
        //     : [...userData.activity.likes, video.element._id]

        updateUserData({ AccessToken: userData.accessToken, UpdateFields: { "activity": { likes: video.element._id } } })
    }

    const handleDislikePress = () => {
        updateUserData({ AccessToken: userData.accessToken, UpdateFields: { "activity": { dislikes: video.element._id } } })
    }

    const handleSubscribePress = () => {
        updateUserData({ AccessToken: userData.accessToken, UpdateFields: { "activity": { subscriptions: video.element.author } } })
    }

    return (
        <div
            className="videoArea-container"
            videomode={video.active ? '1' : '0'}
        >
            {video.active &&
            <>
                <form className="videoArea-videoContainer">
                    <img className='videoArea-video' src={video.element.image} alt="" ref={videoAreaRef} />
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
                        <div
                            className="videoArea-channelInfo-subscribeButton videoArea-button"
                            onClick={() => handleSubscribePress()}
                        >Subscribe</div>
                        <div className="videoArea-ratingSection">
                            <div
                                className="videoArea-ratingSection-likes videoArea-button"
                                title='I like this'
                                onClick={() => handleLikePress()}
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
                                onClick={() => handleDislikePress()}
                            >
                                <Icons.ThumbUp style={{transform: 'rotateZ(180deg)'}}/>
                            </div>
                        </div>
                    </div>
                    <div className="videoArea-description">{video.element.description}</div>
                </form>
                <CommentsArea
                    videoId = {video.element._id}
                />
            </>}
        </div>
    )
}
