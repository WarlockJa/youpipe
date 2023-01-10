import './videoarea.scss'
import Icons from '../../Assets/icons'
import { useCallback, useRef, useState } from 'react'
import { useVideo, useVideoUpdate } from '../../ContextProviders/VideoContext'
import { useAuthData } from '../../ContextProviders/AuthContext'
import { useQuery, useQueryUpdate } from '../../ContextProviders/QueryProvider'
import useFetchWithPagination from '../../Utils/useFetchWithPagination'
import { PostComment, postUnauthorizedCommentsRequest } from '../../Utils/API/RequestsLibrary'
import EmptyPlug from '../../Utils/EmptyPlug'
import LoadingPlug from '../../Utils/LoadingPlug'

export default function VideoArea() {
    // video context
    const video = useVideo()
    const ChangeVideo = useVideoUpdate()
    // auth context
    const userData = useAuthData()
    // query context
    const query = useQuery()
    const ChangeQuery = useQueryUpdate()
    // add comment necessities
    const [showAddCommentButtons, setShowAddCommentButtons] = useState(false)
    const [commentText, setCommentText] = useState('')

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

    // TODO: make an export function
    const dateFormat = new Intl.DateTimeFormat("en-GB", {day: '2-digit', hour: '2-digit', minute: '2-digit'})

    // preparing pureQuery for the fetch hook
    const pureQuery = { amountToFind: video.amountToFind, video: video.element._id }

    // fetching comments data
    const { loading, hasMore, data } = useFetchWithPagination({ query: pureQuery, request: postUnauthorizedCommentsRequest })

    // pagination setup
    const observer = useRef()
    const paginationMarkerElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                ChangeVideo({ ...video, amountToFind: video.amountToFind + 20 })
            }
        })

        if (node) observer.current.observe(node)
    },[loading, hasMore])

    // returning comments array
    const Comments = (props) => {
        const { commentsArray } = props
        if(loading) return <LoadingPlug />
        if(commentsArray.length === 0) return <EmptyPlug />

        const result = commentsArray.map((item, index) => {
            return <div key={'comment' + index} className="comments-comment">
                <div className="avatarContainer">
                    <img src={item.avatar} alt="" />
                </div>
                <div className="comment-body">
                    <div className="body-header">
                        <p className="comment-author">{item.author}</p>
                        <p className="comment-date">{dateFormat.format(Date.now() - Date.parse(item.date))} ago</p> 
                    </div>
                    <div className='comment-text'>{item.comment}</div>
                </div>
                <div className="comment-menu">
                    <div className="dots-container">
                        <div className="dots"></div>
                        <div className="dots"></div>
                        <div className="dots"></div>
                    </div>
                </div>
            </div>
        })

        if(hasMore) result.push(<div className="paginationMarker" ref={paginationMarkerElementRef}></div>)
        return result
    }

    // handling add comment buttons
    const handleCancelCommentClick = () => {
        setCommentText(() => '')
        setShowAddCommentButtons(() => false)
    }

    const handleAddCommentClick = (comment) => {
        if(!commentText) return
        const newCommentData = { video: video.element._id, comment: comment, avatar: userData.avatar }
        PostComment({ AccessToken: userData.accessToken, CommentData: newCommentData })
        setCommentText(() => '')
        setShowAddCommentButtons(() => false)
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
                <form className="videoArea-container-commentsSection">
                    <div className="commentsSection-addCommentContainer">
                        <div className="addCommentContainer-header comment-header">
                            <div className="avatarContainer">
                                {userData ? <img src={userData.avatar} alt="" /> : <Icons.Person />}
                            </div>
                            <textarea
                                className='commentBody'
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onClick={() => setShowAddCommentButtons(true)}
                            ></textarea>
                        </div>
                        <div className={showAddCommentButtons ? "addCommentContainer-activeSection" : "addCommentContainer-activeSection invisible"}>
                            <div
                                className="cancelComment videoArea-button"
                                onClick={() => handleCancelCommentClick()}
                            >Cancel</div>
                            <div
                                className={commentText ? "addComment videoArea-button" : "addComment videoArea-button inactive"}
                                onClick={() => handleAddCommentClick(commentText)}
                            >Comment</div>
                        </div>
                    </div>
                    <div className="commentsSection-comments">
                        <Comments commentsArray={data}/>
                        <div className="paginationMarker" ref={paginationMarkerElementRef}></div>
                    </div>
                </form>
            </>}
        </div>
    )
}
