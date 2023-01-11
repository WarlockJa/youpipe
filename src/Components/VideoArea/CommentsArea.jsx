import './commentsarea.scss'
import Icons from "../../Assets/icons"
import { useCallback, useRef, useState } from "react"
import { useAuthData } from "../../ContextProviders/AuthContext"
import { useVideo, useVideoUpdate } from "../../ContextProviders/VideoContext"
import { PostComment, postUnauthorizedCommentsRequest } from "../../Utils/API/RequestsLibrary"
import EmptyPlug from "../../Utils/EmptyPlug"
import LoadingPlug from "../../Utils/LoadingPlug"
import useFetchWithPagination from "../../Utils/useFetchWithPagination"
import CommentMenu from './CommentMenu'

export default function CommentsArea() {
    // video context
    const video = useVideo()
    const ChangeVideo = useVideoUpdate()
    // auth context
    const userData = useAuthData()
    // add comment necessities
    const [showAddCommentButtons, setShowAddCommentButtons] = useState(false)
    const [commentText, setCommentText] = useState('')

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

    // clearing up unfinished comment on switch to another page
    const VideoModeCheck = () => {
        if(commentText) handleCancelCommentClick()
        return <LoadingPlug />
    }
    
    const [commentMenuState, setCommentMenuState] = useState(null)
    const commentsRef = useRef([])
    // comment menu click
    const handleCommentMenuClick = (e) => {
        
        if(e.target.id !== '') setCommentMenuState(e.target.id)
    }

    // returning comments array
    const Comments = (props) => {
        const { commentsArray, dateFormat } = props
        if(commentsArray.length === 0) return <EmptyPlug />

        const result = commentsArray.map((item, index) => {
            return( 
                <div key={'comment' + index} className="comments-comment">
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
                        <div
                            className="dots-container"
                            id={index}
                            ref={element => commentsRef[index] = element}
                            onClick={(e) => handleCommentMenuClick(e)}
                        >
                            <div className="dots"></div>
                            <div className="dots"></div>
                            <div className="dots"></div>
                        </div>
                    </div>
                    <CommentMenu
                        show={commentMenuState===index.toString()}
                        owner={item.author === userData.name}
                        commentMenuState={commentMenuState}
                        setCommentMenuState={setCommentMenuState}
                        id={item._id}
                    />
                </div>
            )
        })

        if(hasMore) result.push(<div className="paginationMarker" ref={paginationMarkerElementRef}></div>)
        return result
    }

    // handling add comment buttons
    const handleCancelCommentClick = () => {
        setCommentText('')
        setShowAddCommentButtons(false)
        setCommentMenuState(null)
    }

    const handleAddCommentClick = (props) => {
        const { comment, videoId, userAvatar, accessToken } = props
        if(!comment) return
        const newCommentData = { video: videoId, comment: comment, avatar: userAvatar }
        PostComment({ AccessToken: accessToken, CommentData: newCommentData })
        setCommentText(() => '')
        setShowAddCommentButtons(() => false)
    }

    return (
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
                        placeholder="Add a comment..."
                    ></textarea>
                </div>
                <div className={showAddCommentButtons ? "addCommentContainer-activeSection" : "addCommentContainer-activeSection invisible"}>
                    <div
                        className="cancelComment videoArea-button"
                        onClick={() => handleCancelCommentClick()}
                    >Cancel</div>
                    <div
                        className={commentText ? "addComment videoArea-button" : "addComment videoArea-button inactive"}
                        onClick={() => handleAddCommentClick({
                            comment: commentText,
                            videoId: video.element._id,
                            userAvatar: userData.avatar,
                            accessToken: userData.accessToken
                        })}
                    >Comment</div>
                </div>
            </div>
            <div className="commentsSection-comments">
                {loading
                    ? <VideoModeCheck />
                    : <Comments
                        commentsArray={data}
                        dateFormat={dateFormat}
                    />
                }
            </div>
        </form>
    )
}
