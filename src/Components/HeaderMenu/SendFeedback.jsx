import { useState, useRef, useCallback } from "react"
import { useMenuData, useMenuUpdateData } from "../../ContextProviders/MenuContext"
import useEventOutsideListener from "../../Utils/useEventOutsideListener"
import { sendMail } from "../../Utils/API/SendEmail"

export default function SendFeedback(props) {
    const { iconMenuRef, noUser } = props
    // feedback data
    const [feedbackText, setFeedbackText] = useState('')
    // menu context
    const menuData = useMenuData()
    const ChangeMenu = useMenuUpdateData()
    const sendFeedbackMenuRef = useRef()
    
    // closing user menu if clicked outside of it's area using custom hook
    const handleClickOutside = useCallback((event) => {
        if (menuData.sendFeedback === false) { return } // menu already closed
        if (sendFeedbackMenuRef.current.contains(event.target)) { return } // clicking inside the menu area
        if (iconMenuRef.current.contains(event.target)) { return } // clicking on the icon that would close the menu instead
        if (!sendFeedbackMenuRef.current) { return } // no menu reference

        ChangeMenu({...menuData, sendFeedback: false}) // closing the menu
    }, [menuData.sendFeedback])

    useEventOutsideListener('mousedown', handleClickOutside, document)

    const handleSendFeedback = (message) => {
        if(message !== '') {
            sendMail({ emailAddress: process.env.REACT_APP_MAIL_USER, emailTopic: 'YouPipe feedback', emailBody: message })
            setFeedbackText(() => 'Thank you for your feedback!')
        }
    }

    return (
        <form
            className="menu sendFeedback"
            visible={menuData.sendFeedback ? 1 : 0}
            ref={sendFeedbackMenuRef}
        >
            <div className="menu-return">
                <div
                    className="menu-return-arrow"
                    onClick={() => 
                        noUser ? ChangeMenu({...menuData, noUserMenu: !menuData.noUserMenu, sendFeedback: !menuData.sendFeedback })
                        : ChangeMenu({...menuData, userMenu: !menuData.userMenu, sendFeedback: !menuData.sendFeedback })
                    }
                >
                    <div className="arrow-part1"></div>
                    <div className="arrow-part2"></div>
                    <div className="arrow-part3"></div>
                </div>
                <p>User menu</p>
            </div>
            <div className="menu-feedback">
                <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder='Your message'
                ></textarea>
                <div
                    className="menu-button"
                    inactive={feedbackText === '' || feedbackText === 'Thank you for your feedback!' ? 1 : 0}
                    onClick={() => handleSendFeedback(feedbackText)}
                >Submit</div>
            </div>
        </form>
    )
}
