import { useRef, useEffect } from 'react'

export default function useEventOutsideListener(eventName, handler, method) {
    const savedHandler = useRef();

    useEffect (() => {
        savedHandler.current = handler
    },[handler])

    useEffect (() => {
        const eventListener = (event) => savedHandler.current(event)

        method === 'window'
        ? window.addEventListener(eventName, eventListener, { passive: false })
        : document.addEventListener(eventName, eventListener, { passive: false })
        
        return () => {
            method === 'window'
            ? window.removeEventListener(eventName, eventListener)
            : document.removeEventListener(eventName, eventListener)
        }
    },[eventName])
}