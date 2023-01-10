export default function DataFetch(props) {
    const { request, callback } = props

    fetch(request).then((response) => callback(response))
}
