export default function handleArrowClick(props) {
    const { direction, element, offset, callback } = props
    const posLeft = direction === 'left' ? element.current.scrollLeft -= offset : element.current.scrollLeft += offset
    callback(posLeft, element)
}