import { useState, useEffect } from "react"
import useResize from "./useResize"

export default function useGridCalculator(refElement, tileWidth, options) {
    const globalWidth = useResize()
    const [columnsNumber, setColumnsNumber] = useState(0)

    useEffect (() => {
        const calcColumnsNumber =  Math.floor(refElement.current.offsetWidth / tileWidth)
        setColumnsNumber(calcColumnsNumber === 0 ? 1 : calcColumnsNumber )
    },[refElement.current?.offsetWidth, globalWidth, options])

    return columnsNumber
}