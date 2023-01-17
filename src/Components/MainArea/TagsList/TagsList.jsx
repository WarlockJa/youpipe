import './tagslist.scss'
import Icons from '../../../Assets/icons'
import tagsListItems from "../../../Utils/taglist.json"
import { useRef, useState, useCallback } from 'react'
import useEventListener from '../../../Utils/useEventListener'
import handleArrowClick from './handleArrowClick'
import { useQuery, useQueryUpdate } from '../../../ContextProviders/QueryContext'
import { useTheme } from '../../../ContextProviders/ThemeContext'

export default function TagsList() {
  const tagsListRef = useRef(null)
  const [ tagsListTopBottomFlags, setTagsListTopBottomFlags ] = useState({top: true, bottom: false})
  // videos query context
  const query = useQuery()
  const ChangeQuery = useQueryUpdate()
  // theme context
  const darkTheme = useTheme()

  const flagsTopBottom = (posL, elRef) => {
    const scrolledTop = posL <= 0 ? true : false
    const scrolledBottom = posL >= elRef.current.scrollWidth - elRef.current.clientWidth ? true : false
    setTagsListTopBottomFlags(() => ({top: scrolledTop, bottom: scrolledBottom}))
  }

  const handleTagListScroll = useCallback((event) => {
    event.preventDefault()
    event.stopPropagation()

    const afterScrollPos = tagsListRef.current.scrollLeft += event.deltaY * 5

    flagsTopBottom(afterScrollPos, tagsListRef)

  },[])

  useEventListener('wheel', handleTagListScroll, tagsListRef)

  const handleTagClick = (tagValue) => {
    if(tagValue === 'All') {
      ChangeQuery({
        amountToFind: query.defaults.amountToFind,
        fieldToSortBy: query.defaults.fieldToSortBy,
        query: query.defaults.query,
        defaults: query.defaults
      })
      window.location.replace(process.env.REACT_APP_YOUPIPE_URI)
    } else {
      ChangeQuery({
        amountToFind: query.defaults.amountToFind,
        fieldToSortBy: query.defaults.fieldToSortBy,
        query: { type: "tags", field: [tagValue] },
        defaults: query.defaults
      })
      window.history.pushState("tags", "", process.env.REACT_APP_YOUPIPE_URI + "?tags=" + encodeURI(tagValue))
    }
  }

  return (
    <div
      className="tagsContainer"
      darktheme={darkTheme ? 1 : 0}
    >
        <div
          className='tagsContainer-arrow arrow-left'
          scrolledtop={tagsListTopBottomFlags.top ? 1 : 0}
          onClick={() => handleArrowClick({ direction: 'left', element: tagsListRef, offset: 250, callback: flagsTopBottom })}
        >
            <div className="arrow-shadow"></div>
            <Icons.Arrow alt="Previous" />
        </div>
        <div className="tagsContainer-tagsList" ref={tagsListRef}>
          {tagsListItems.items.map((item, index) => {
            return <div
              key={'TagsList'+index}
              className='tagsList-tag'
              onClick={() => handleTagClick(item.itemName)}
            >{item.itemName}</div>
          })}
        </div>
        <div
          className='tagsContainer-arrow arrow-right'
          scrolledtop={tagsListTopBottomFlags.bottom? 1: 0}
          onClick={() => handleArrowClick({ direction: 'right', element: tagsListRef, offset: 250, callback: flagsTopBottom })}
        >
          <div className="arrow-shadow"></div>
          <Icons.Arrow alt="Next" />
        </div>
    </div>
  )
}