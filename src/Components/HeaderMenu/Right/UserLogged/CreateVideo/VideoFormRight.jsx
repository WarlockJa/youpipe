import { EditDescription, EditLikes, EditTags, EditViews, EditImage } from './CreateVideoMenuItems'
import { useAuthData } from '../../../../../ContextProviders/AuthContext'

export default function VideoFormRight(props) {
    const { active } = props
    const userData = useAuthData()

    const RenderSwitch = (props) => {
        const { value } = props
        switch(value) {
            case 1:
                return <EditDescription />
            case 2:
                return <EditLikes />
            case 3:
                return <EditViews />
            case 4:
                return <EditTags />
            default:
                return <EditDescription />
        }
    }

    return (
        <div className="right">
            <EditImage />
            <div className="userIcon">
                <img src={userData.avatar} alt="" />
            </div>
            <RenderSwitch value={active} />
        </div>
    )
}
