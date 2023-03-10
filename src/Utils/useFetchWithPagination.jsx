import { useState, useEffect } from "react"
import { postUnauthorizedRequest } from "./API/RequestsLibrary"

export default function useFetchWithPagination(props) {
    const { query, request } = props

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [hasMore, setHasMore] = useState(null)

    // forming a macro dependency for different query use cases
    const { amountToFind, ...queryRest } = query
    const dependencyField = JSON.stringify(queryRest)
    
    // clear all data when query changes
    useEffect(() =>{
        setData([])
    },[dependencyField])

    // fetch more data when the page number changes
    useEffect(() => {
        setLoading(true)
        let isCanceled = false

        const callback = (result) => {
            if(!isCanceled) {
                setData(result.result)
                setHasMore(result.hasMore)
            }
            setLoading(false)
        }

        if (query.amountToFind !== 0) {
            console.log('Fetch query firing')
            postUnauthorizedRequest({ body: query, request: request, setDataArray: callback })
        } else {
            setLoading(false)
        }

        return () => isCanceled = true

    },[query.amountToFind, dependencyField])

    return { loading, data, hasMore }
}
