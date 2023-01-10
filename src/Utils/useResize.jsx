import { useEffect, useState } from "react"

export default function useResize() {
    const [ screenWidth, setScreenWidth ] = useState(window.innerWidth)
    
    useEffect (() => {
      
        const handleResize = (e) => {
            setScreenWidth(() => e.target.innerWidth)
        }
    
        window.addEventListener('resize',handleResize)
    
        return () => window.removeEventListener('resize', handleResize)
    },[])

    return screenWidth
}
