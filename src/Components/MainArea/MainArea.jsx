import './mainarea.scss'
import RowContainer from './RowContainer/RowContainer'
import TagsList from './TagsList/TagsList'
import useGridCalculator from '../../Utils/useGridCalculator'
import React, { useRef, useCallback } from 'react'
import LoadingPlug from '../../Utils/LoadingPlug'
import EmptyPlug from '../../Utils/EmptyPlug'
import useFetchWithPagination from '../../Utils/useFetchWithPagination'
import { useQuery, useQueryUpdate } from '../../ContextProviders/QueryProvider'
import { useSideMenu, useSideMenuUpdate } from '../../ContextProviders/SideMenuContext'
import { useVideo } from '../../ContextProviders/VideoContext'
import { postUnauthorizedVideosRequest } from '../../Utils/API/RequestsLibrary'

export default function MainArea() {
  const mainContainerRef = useRef(null)
  // video query context
  const query = useQuery()
  const ChangeQuery = useQueryUpdate()
  // side menu context
  const sideMenuOptions = useSideMenu()
  const ChangeSideMenu = useSideMenuUpdate()
  // video context
  const video = useVideo()
  // number of tiles in a row
  const columnsNumber = useGridCalculator(mainContainerRef, 320, ChangeSideMenu)

  // preparing pureQuery for the fetch hook
  const { defaults, ...pureQuery } = query
  pureQuery.amountToFind *= columnsNumber
  // fetching videos from the custom hook query
  const { loading, data, hasMore } = useFetchWithPagination({ query: pureQuery, request: postUnauthorizedVideosRequest })

  // pagination setup
  const observer = useRef()
  const paginationMarkerElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        ChangeQuery({ ...query, amountToFind: query.amountToFind + query.defaults.increment })
      }
    })

    if (node) observer.current.observe(node)
  },[loading, hasMore])
  
  // arranging fetched videos into rows
  const MainAreaRowsFill = (props) => {
    const { videos, rowLength } = props
    if (videos.length === 0) return
    const rowsNumber = Math.floor(videos.length / rowLength) + 1
    let lastLinePassed = false
    
    return [...Array(rowsNumber)].map((_item, index) => {
      const rowStart = index * rowLength
      const notLastLine = rowStart + rowLength < videos.length
      const rowEnd = notLastLine ? rowStart + rowLength : videos.length

      if (lastLinePassed) { return }

      if(notLastLine) {
        return <RowContainer key={'RowContainer'+index} rowElementsNumber={rowLength} elements={videos.slice(rowStart, rowEnd)} />
      }else{
        lastLinePassed = true
        return(
          <React.Fragment key={'PaginatorFragment'+index}>
            {hasMore && <div className="paginationMarker" ref={paginationMarkerElementRef}></div>}
            <RowContainer key={'RowContainer'+index} rowElementsNumber={rowLength} elements={videos.slice(rowStart, rowStart + rowLength)} />
          </React.Fragment>
        )
      }
    })
  }

  return (
    <div
      className='mainContainer'
      sidemenustate={ video.active ? '2' : sideMenuOptions.sideMenuFolded ? '0' : '1' }
      ref={mainContainerRef}
    >
      <TagsList />
      <MainAreaRowsFill videos={data} rowLength={columnsNumber} />
      {!loading && data.length === 0 && <EmptyPlug />}
      {loading && <LoadingPlug />}
    </div>
  )
}