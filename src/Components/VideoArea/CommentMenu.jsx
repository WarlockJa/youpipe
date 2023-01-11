import { useCallback, useRef } from "react"
import { useAuthData } from "../../ContextProviders/AuthContext"
import { useVideo, useVideoUpdate } from "../../ContextProviders/VideoContext"
import { DeleteComment } from "../../Utils/API/RequestsLibrary"
import useEventOutsideListener from "../../Utils/useEventOutsideListener"

export default function CommentMenu(props) {
    const { setCommentMenuState, commentMenuState, show, owner, id } = props
    const commentMenuRef = useRef()
    // auth context
    const userData = useAuthData()
    // video context
    const video = useVideo()
    const ChangeVideo = useVideoUpdate()

    // closing user menu if clicked outside of it's area using custom hook
    const handleClickOutside = useCallback((event) => {
        
        if (!show) { return } // menu already closed
        if (commentMenuRef.current.contains(event.target)) { return } // clicking inside the menu area
        if (!commentMenuRef.current) { return } // no menu reference

        setCommentMenuState(null) // closing the menu
    }, [commentMenuState])

    useEventOutsideListener('mousedown', handleClickOutside)

    const handleDeleteComment = (props) => {
        const { userData, id, video } = props
        DeleteComment({ AccessToken: userData.accessToken, body: { id: id } })
        setCommentMenuState(null)
        ChangeVideo({ ...video, amountToFind: video.amountToFind - 1 })
    }

    return (
        <div
            className="menu"
            visible={show ? 1 : 0}
            ref={commentMenuRef}
        >
            {owner
                ? <div 
                    className="menu-item"
                    onClick={() => handleDeleteComment({ userData: userData, id: id, video: video })}
                >Delete</div>
                : <div
                    className="menu-item"
                    onClick={() => setCommentMenuState(null)}
                >Report</div>
            }
        </div>
    )
}
