import './plugs.scss'

export default function LoadingPlug(theme) {
    return <div className="loadingPlug" darktheme={theme ? 1 : 0}>Loading...</div>
}
