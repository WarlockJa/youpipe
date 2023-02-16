import './rowcontainer.scss'
import VideoTile from "../VideoTile/VideoTile"

export default function RowContainer(props) {
    const { rowElementsNumber, elements } = props

    const SpawnTiles = () => {
        return [...Array(rowElementsNumber)].map((_item, index) => {
            return <VideoTile key={elements[index] ? 'VideoTile' + elements[index]._id : 'StumpTile' + index} element={elements[index]} />
        })
    }

    return (
        <div className="row-container">
            <SpawnTiles />
        </div>
    )
}
