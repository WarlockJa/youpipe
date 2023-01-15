export default function NoUserAnimationPlug(props) {
    const { trigger } = props
    return (
        <div
            className="noUserAnimationPlug"
            trigger={trigger ? 1 : 0}
        >
      </div>
    )
}
