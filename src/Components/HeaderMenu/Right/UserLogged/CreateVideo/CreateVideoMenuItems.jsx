import Slider from "../../../../../Utils/Slider"
import Icons from '../../../../../Assets/icons'
import { useCreateVideoData, useCreateVideoUpdateData } from "../../../../../ContextProviders/CreateVideoContext"
import { useState } from "react"
import VideoImages from './videoimages.json'
import Tags from '../../../../../Utils/taglist.json'

export function EditImage() {
    const createVideoData = useCreateVideoData()
    const ChangeCreateVideo = useCreateVideoUpdateData()
    const [imageMenuState, setImageMenuState] = useState(false)

    // changing URL of the preview image to full image
    const previewToFullImage = (imagePath) => {
        return imagePath.replace('PreviewImages', 'VideoImages')
    }

    const VideoImagesList = (items) => {
        return items.items.map((item, index) => {
            return(
                <div
                    key={index}
                    className="videoImageTile"
                    onClick={() => ChangeCreateVideo({ ...createVideoData, image: item.image, previewImage: previewToFullImage(item.image), errors: { image: false , ...ChangeCreateVideo.errors } })}
                >
                    <img src={item.image} alt="" />
                </div>
            )
        })
    } 

    const styleErrors = createVideoData.errors.image ? { border: '1px solid red', borderRadius: '15px' } : { border: '1px solid transparent' }

    return(
        <>
            <div
                className="videoImage"
                title='Select image'
                onClick={() => setImageMenuState((prev) => !prev)}
                style={styleErrors}
            >
                <img src={createVideoData.image} alt="" />
            </div>
            <div
                className="imageSelect"
                show={imageMenuState ? '1' : '0'}
                onClick={() => setImageMenuState((prev) => !prev)}
            >
                <div className="imagesGrid">
                    <VideoImagesList items={VideoImages.items} />
                </div>
            </div>
        </>
    )
}

export function EditDescription() {
    const createVideoData = useCreateVideoData()
    const ChangeCreateVideo = useCreateVideoUpdateData()

    const styleErrors = createVideoData.errors.title ? { border: '1px solid red' } : { }

    return (
        <>
            <textarea
                className="videoTitle"
                placeholder='Video title'
                onChange={(e) => {ChangeCreateVideo({ ...createVideoData, "title": e.target.value })}}
                value={createVideoData.title}
                style={styleErrors}
            ></textarea>
            <textarea
                className="videoDescription"
                placeholder='Video description'
                onChange={(e) => {ChangeCreateVideo({ ...createVideoData, "description": e.target.value })}}
                value={createVideoData.description}
            ></textarea>
        </>
    )
}

export function EditViews() {
    const createVideoData = useCreateVideoData()
    const ChangeCreateVideo = useCreateVideoUpdateData()

    return (
        <>
            <div className="itemDescription">
                <p>You can pre-adjust views count for the video</p>
            </div>
            <div className="sliders">
                <div className="sliderContainer">
                    <Slider
                        className='slider'
                        trackClassName='sliderTrack'
                        sliderThumb='sliderThumb'
                        value={createVideoData.views}
                        setValue={(e) => ChangeCreateVideo({ ...createVideoData, "views": e })}
                    />
                    <Icons.Views />
                    <label className="views">{createVideoData.views}</label>
                </div>
            </div>
        </>
    )
}

export function EditLikes() {
    const createVideoData = useCreateVideoData()
    const ChangeCreateVideo = useCreateVideoUpdateData()
    
    return (
        <>
            <div className="itemDescription">
                <p>You can pre-adjust likes/dislikes counts for the video</p>
            </div>
            <div className="sliders">
                <div className="sliderContainer">
                    <Slider
                        className='slider'
                        trackClassName='sliderTrackLikes'
                        sliderThumb='sliderThumb'
                        value={createVideoData.rating.likes}
                        setValue={(e) => ChangeCreateVideo({ ...createVideoData, rating: { "likes": e, "dislikes": createVideoData.rating.dislikes } })}
                    />
                    <Icons.ThumbUp />
                    <label className="likes">{createVideoData.rating.likes}</label>
                </div>
                <div className="sliderContainer">
                    <Slider
                        className='slider'
                        trackClassName='sliderTrack'
                        sliderThumb='sliderThumb'
                        value={createVideoData.rating.dislikes}
                        setValue={(e) => ChangeCreateVideo({ ...createVideoData, rating: { "likes": createVideoData.rating.likes, 'dislikes': e } })}
                    />
                    <Icons.ThumbUp style={{transform: 'rotateZ(180deg)'}}/>
                    <label className="dislikes">{createVideoData.rating.dislikes}</label>
                </div>
            </div>
        </>
    )
}

export function EditTags() {
    const createVideoData = useCreateVideoData()
    const ChangeCreateVideo = useCreateVideoUpdateData()
    const [ tagsMenuState, setTagsMenuState ] = useState(true)
    const [ tagsList, setTagsList ] = useState(Tags.items.map(item => { return { itemName: item.itemName, active: false } }))

    const SelectedTags = (items) => {
        return items.items.length === 0
        ? <p className="emptyTagsArray">No tags selected</p>
        : (items.items.map((item, index) => {
            return (
                <div
                    key={index}
                    className='tagTileSelected'
                >
                    <p>{item}</p>
                </div>
            )
        }))
    }

    const FullTagsList = (items) => {
        return (
            items.items.map((item, index) => {
            if(item.itemName !== 'All') {
                return(
                    <div
                        key={index}
                        className={item.active ? 'tagTile active' : 'tagTile'}
                        onClick={() => setTagsList(tagsList.map(tag => {
                            return item.itemName === tag.itemName ? { itemName: tag.itemName, active: !tag.active } : tag
                        }))}
                    >
                        <p>{item.itemName}</p>
                    </div>
                )
            }
        }))
    }

    const submitActiveTags = (tags) => {
        const result = []
        tags.map(item => {
            if(item.active){result.push(item.itemName)}
        })
        ChangeCreateVideo({ ...createVideoData, tags: result })
    }

    return (
        <>
            <div className="tagsSelectSwitch">
                <p onClick={() => {
                    setTagsMenuState((prev) => !prev)
                    submitActiveTags(tagsList)
                }}>
                    {tagsMenuState ? 'Add tags' : 'Confirm'}
                </p>
            </div>
            <div
                className={tagsMenuState ? "selectedTagsArea" : "tagsArea" }
            >
                { tagsMenuState ? <SelectedTags items={createVideoData.tags} /> : <FullTagsList items={tagsList} />}
            </div>
        </>
    )
}
