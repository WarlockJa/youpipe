export default function TimeParser(date) {
    const dateNow = new Date(Date.now())
    const inputDate = new Date(Date.parse(date))

    const dateDelta = dateNow.getTime() - inputDate.getTime()

    let result = dateDelta
    // seconds
    result = Math.floor(result / 1000)
    if(result <= 59) return result[result.length - 1] === 1 && result !== 11 ? `${result} second ago` : `${result} seconds ago`
    // minutes 60
    result = Math.floor(result / 60)
    if(result <= 59) return result[result.length - 1] === 1 && result !== 11 ? `${result} minute ago` : `${result} minutes ago`
    // hours 60 * 60
    result = Math.floor(result / 60)
    if(result <= 23) return result[result.length - 1] === 1 && result !== 11 ? `${result} hour ago` : `${result} hours ago`
    // days 60 * 60 * 24
    result = Math.floor(result / 24)
    if(result <= 30) return result[result.length - 1] === 1 && result !== 11 ? `${result} day ago` : `${result} days ago`
    // months 60 * 60 * 24 * 30
    result = Math.floor(result / 30)
    if(result <= 11) return result === 1 ? '1 month ago' : `${result} months ago`
    // years 60 * 60 * 24 * 30 * 12
    result = Math.floor(result / 12)
    return result[result.length - 1] === 1 && result !== 11 ? '1 year ago' : `${result} years ago`
}
