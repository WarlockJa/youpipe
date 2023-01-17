import './commentsarea.scss'
import Icons from "../../Assets/icons"
import { useCallback, useRef, useState } from "react"
import { useAuthData, useAuthUpdateData } from "../../ContextProviders/AuthContext"
import { PostComment, postUnauthorizedCommentsRequest, RefreshToken } from "../../Utils/API/RequestsLibrary"
import EmptyPlug from "../../Utils/EmptyPlug"
import LoadingPlug from "../../Utils/LoadingPlug"
import useFetchWithPagination from "../../Utils/useFetchWithPagination"
import CommentMenu from './CommentMenu'
import { useEffect } from 'react'
import TimeParser from '../../Utils/TimeParser'
import { useTheme } from '../../ContextProviders/ThemeContext'

export default function CommentsArea(props) {
    const { videoId } = props
    // theme context
    const darkTheme = useTheme()
    // auth context
    const userData = useAuthData()
    const ChangeUser = useAuthUpdateData()
    // comments fetch query
    const [commentsQuery, setCommentsQuery] = useState({ amountToFind: 20, video: videoId })
    // add comment necessities
    const [showAddCommentButtons, setShowAddCommentButtons] = useState(false)
    const [commentText, setCommentText] = useState('')
    // comment's menu state
    const [commentMenuState, setCommentMenuState] = useState(null)

    // resetting comments state on a new slide click
    useEffect(() => {
        setCommentsQuery({ amountToFind: 20, video: videoId })
        handleCancelCommentClick()
    },[videoId])

    // fetching comments data
    const { loading, hasMore, data } = useFetchWithPagination({ query: commentsQuery, request: postUnauthorizedCommentsRequest })

    // pagination setup
    const observer = useRef()
    const paginationMarkerElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore > 0) {
                setCommentsQuery({ ...commentsQuery, amountToFind: commentsQuery.amountToFind + 20 })
            }
        })

        if (node) observer.current.observe(node)
    },[loading, hasMore])

    // returning comments array
    const Comments = (props) => {
        const { commentsArray } = props
        if(commentsArray.length === 0) return

        const result = commentsArray.map((item, index) => {
            return( 
                <div key={'comment' + index} className="comments-comment">
                    <div className="avatarContainer">
                        <img src={item.avatar} alt="" />
                    </div>
                    <div className="comment-body">
                        <div className="body-header">
                            <p className="comment-author">{item.author}</p>
                            <p className="comment-date">{TimeParser(item.date)}</p> 
                        </div>
                        <div className='comment-text'>{item.comment}</div>
                    </div>
                    <div className="comment-menu">
                        <div
                            id={index}
                            className="dots-container"
                            onClick={(e) => e.target.id && setCommentMenuState(e.target.id)}
                        >
                            <div className="dots"></div>
                            <div className="dots"></div>
                            <div className="dots"></div>
                        </div>
                    </div>
                    <CommentMenu
                        show={commentMenuState===index.toString()}
                        owner={userData?.name ? item.author === userData.name : false}
                        commentMenuState={commentMenuState}
                        setCommentMenuState={setCommentMenuState}
                        commentsQuery={commentsQuery}
                        setCommentsQuery={setCommentsQuery}
                        id={item._id}
                    />
                </div>
            )
        })

        if(hasMore > 0) result.push(<div key={"PaginationMarker"} className="paginationMarker" ref={paginationMarkerElementRef}></div>)
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
        setCommentsQuery({ ...commentsQuery, amountToFind: commentsQuery + 1 })
        setCommentText(() => '')
        setShowAddCommentButtons(() => false)
    }

    // handle add comment activation
    const handleAddCommentInterfaceActive = () => {
        if(!userData) return

        RefreshToken(ChangeUser)
        setShowAddCommentButtons(true)
    }

    return (
        <form
            className="videoArea-container-commentsSection"
            darktheme={darkTheme ? 1 : 0}
        >
            <div className="commentsSection-addCommentContainer">
                <div className="addCommentContainer-header comment-header">
                    <div className="avatarContainer">
                        {userData ? <img src={userData.avatar} alt="" /> : <Icons.Person />}
                    </div>
                    <textarea
                        className='commentBody'
                        value={commentText}
                        onChange={(e) => userData && setCommentText(e.target.value)}
                        onClick={() => handleAddCommentInterfaceActive()}
                        placeholder={userData ? "Add a comment..." : "Log in to leave a comment"}
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
                            videoId: videoId,
                            userAvatar: userData.avatar,
                            accessToken: userData.accessToken
                        })}
                    >Comment</div>
                </div>
            </div>
            <div className="commentsSection-comments">
                 <Comments commentsArray={data} />
                {loading && <LoadingPlug darktheme={darkTheme} />}
                {!loading && data.length === 0 && <EmptyPlug darktheme={darkTheme} />}
            </div>
        </form>
    )
}
