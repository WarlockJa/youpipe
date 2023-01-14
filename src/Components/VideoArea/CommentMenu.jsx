import { useCallback, useRef } from "react"
import { useAuthData } from "../../ContextProviders/AuthContext"
import { DeleteComment } from "../../Utils/API/RequestsLibrary"
import useEventOutsideListener from "../../Utils/useEventOutsideListener"

export default function CommentMenu(props) {
    const { setCommentMenuState, commentMenuState, show, owner, id, commentsQuery, setCommentsQuery } = props
    const commentMenuRef = useRef()
    // auth context
    const userData = useAuthData()

    // closing user menu if clicked outside of it's area using custom hook
    const handleClickOutside = useCallback((event) => {
        
        if (!show) { return } // menu already closed
        if (commentMenuRef.current.contains(event.target)) { return } // clicking inside the menu area
        if (!commentMenuRef.current) { return } // no menu reference

        setCommentMenuState(null) // closing the menu
    }, [commentMenuState])

    useEventOutsideListener('mousedown', handleClickOutside, document)

    const handleDeleteComment = (props) => {
        const { userData, id } = props
        DeleteComment({ AccessToken: userData.accessToken, body: { id: id } })
        setCommentsQuery({ ...commentsQuery, amountToFind: commentsQuery.amountToFind - 1 })
        setCommentMenuState(null)
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
                    onClick={() => handleDeleteComment({ userData: userData, id: id })}
                >Delete</div>
                : <div
                    className="menu-item"
                    onClick={() => setCommentMenuState(null)}
                >Report</div>
            }
        </div>
    )
}
