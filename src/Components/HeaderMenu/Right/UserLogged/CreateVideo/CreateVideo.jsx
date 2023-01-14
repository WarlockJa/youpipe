import './createvideo.scss'
import { useCallback, useRef, useState } from 'react'
import VideoFormLeft from './VideoFormLeft'
import VideoFormRight from './VideoFormRight'
import CreateVideoProvider from '../../../../../ContextProviders/CreateVideoContext'
import { useMenuData, useMenuUpdateData } from '../../../../../ContextProviders/MenuContext'
import useEventOutsideListener from '../../../../../Utils/useEventOutsideListener'

export default function CreateVideo(props) {
    const { iconMenuRef } = props
    const [active, setActive] = useState(1)
    const createVideoRef = useRef()
    const menuData = useMenuData()
    const ChangeMenu = useMenuUpdateData()

    // closing user menu if clicked outside of it's area using custom hook
    const handleClickOutside = useCallback((event) => {
        if (menuData.createVideoMenu === false) { return } // menu already closed
        if (createVideoRef.current.contains(event.target)) { return } // clicking inside the menu area
        if (iconMenuRef.current.contains(event.target)) { return } // clicking on the icon that would close the menu instead
        if (!createVideoRef.current) { return } // no menu reference

        ChangeMenu({...menuData, createVideoMenu: false}) // closing the menu
    }, [menuData.createVideoMenu])

    useEventOutsideListener('mousedown', handleClickOutside, document)

    return (
        <form 
            className="createVideo-form"
            ref={createVideoRef}
            visible={menuData.createVideoMenu ? 1 : 0}
        >
            <CreateVideoProvider>
                <VideoFormLeft
                    active={active}
                    setActive={setActive}
                />
                <VideoFormRight
                    active={active}
                />
            </CreateVideoProvider>
        </form>
    )
}
