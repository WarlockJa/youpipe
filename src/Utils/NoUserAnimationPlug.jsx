import Icons from '../Assets/icons'

export default function NoUserAnimationPlug(props) {
    const { trigger } = props
    return (
        <div
            className="noUserAnimationPlug"
            trigger={trigger ? 1 : 0}
        >
            {/* <Icons.Person />
            <p>Login</p> */}
      </div>
    )
}
