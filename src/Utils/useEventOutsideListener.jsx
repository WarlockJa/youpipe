import { useRef, useEffect } from 'react'

export default function useEventOutsideListener(eventName, handler) {
    const savedHandler = useRef();

    useEffect (() => {
        savedHandler.current = handler
    },[handler])

    useEffect (() => {
        const eventListener = (event) => savedHandler.current(event)

        document.addEventListener(eventName, eventListener, { passive: false })

        return () => document.removeEventListener(eventName, eventListener)
    },[eventName])
}