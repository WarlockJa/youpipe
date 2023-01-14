import Icons from '../../../../../Assets/icons'
import { useCreateVideoData, useCreateVideoUpdateData } from '../../../../../ContextProviders/CreateVideoContext'
import { useAuthData } from '../../../../../ContextProviders/AuthContext'
import { useMenuData, useMenuUpdateData } from '../../../../../ContextProviders/MenuContext'
import { createNewVideo } from '../../../../../Utils/API/RequestsLibrary'

export default function VideoFormLeft(props) {
    const { active, setActive } = props
    // create video context
    const CreateVideoData = useCreateVideoData()
    const ChangeCreateVideo = useCreateVideoUpdateData()
    // auth context
    const userData = useAuthData()
    // menu context
    const menuData = useMenuData()
    const ChangeMenu = useMenuUpdateData()

    const clearNewVideoData = () => {
        ChangeCreateVideo({ title: '', description: '', rating: { likes: 0, dislikes: 0 }, image: '/Assets/defaultImage.png', views: 0, tags: [], errors: { image: false, title: false } })
        ChangeMenu({ ...menuData, createVideoMenu:true })
        setActive(1)
    }

    const inputErrorsNewVideoData = (videoData) => {
        const inputErrors = { image: false, title: false }
        if (videoData.title === '') {
            setActive(() => 1)
            inputErrors.title = true
        } else {
            inputErrors.title = false
        }

        if (videoData.image === '/Assets/defaultImage.png') {
            inputErrors.image = true
        } else {
            inputErrors.image = false
        }

        ChangeCreateVideo(() => ({ ...videoData, errors: inputErrors }))
        
        return inputErrors.image ? true :
            inputErrors.title ? true : false
    }

    return (
        <div className="left">
            <div 
                className="cancelImage"
                title='Cancel'
                onClick={() => clearNewVideoData()}
            >
                <Icons.Cancel />
            </div>
            <div
                className={active === 1 ? "active" : ""}
                title='Edit description'
                onClick={() => setActive(1)}
            >
                <Icons.Edit />
            </div>
            <div
                className={active === 2 ? "active" : ""}
                title='Edit likes/dislikes'
                onClick={() => setActive(2)}
            >
                <Icons.Updown />
            </div>
            <div 
                className={active === 3 ? "active" : ""}
                title='Edit views'
                onClick={() => setActive(3)}
            >
                <Icons.Views />
            </div>
            <div 
                className={active === 4 ? "active" : ""}
                title='Edit tags'
                onClick={() => setActive(4)}
            >
                <Icons.Tags />
            </div>
            <div
                title='Upload'
                onClick={() => {
                    if(!inputErrorsNewVideoData(CreateVideoData)) {
                        const { errors, ...NewVideoData } = CreateVideoData
                        createNewVideo({ AccessToken: userData.accessToken, VideoData: NewVideoData })
                        clearNewVideoData()
                    }
                }}
            >
                <Icons.Upload />
            </div>
        </div>
    )
}
