import './plugs.scss'

export default function EmptyPlug(theme) {
    return <div className="emptyPlug" darktheme={theme ? 1 : 0} >There's nothing here. Be first to add something!</div>
}