import { useRef, useEffect } from 'react'

export default function useEventListener(eventName, handler, elRef) {
    const savedHandler = useRef();

    useEffect (() => {
        savedHandler.current = handler
    },[handler])

    useEffect (() => {
        const isSupported = elRef && elRef.current.addEventListener;
        if(!isSupported) return

        const eventListener = (event) => savedHandler.current(event)

        elRef.current.addEventListener(eventName, eventListener, { passive: false })

        return () => elRef.current.removeEventListener(eventName, eventListener)
    },[eventName, elRef])
}