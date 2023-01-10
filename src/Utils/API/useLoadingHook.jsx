import { useCallback, useState } from "react"

export default function useLoadingHook(props) {
    const { callback } = props
    const [ isLoading, setIsLoading ] = useState(true)
    const [ isError, setIsError ] = useState(false)

    const apiRequest = useCallback((request) => {
        setIsLoading(true)
        setIsError(false)
        fetch(request)
            .then(response => response.json())
            .then(result => callback(result))
            .catch((error) => {
                setIsLoading(false)
                setIsError(true)
            })
            .then(() => setIsLoading(false))
    },[callback])

    return { isLoading, apiRequest, isError }
}