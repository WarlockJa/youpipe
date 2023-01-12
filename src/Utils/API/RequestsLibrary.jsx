import DataFetch from "./DataFetch"
const URI = "http://localhost:3500/"


// request to get a new Access Token with existing refresh token
// used in HeaderMenu
export const refreshTokenRequest = new Request(URI + 'refresh', {
    method: 'GET',
    headers: { "Content-Type": "application/json" },
    mode: 'cors',
    cache: 'default',
    secure: true,
    credentials: 'include'
})

// request to get user data with Access Token
// used in HeaderMenu
export const getIdTokenRequest = (AccessToken) => {
    const headers = new Headers({ "Authorization": 'Bearer ' + AccessToken })
    const request = new Request(URI + 'userAuthorized', {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default',
        secure: true,
    })
    return request
}

// request to fetch videos
// used in MainArea
export const postUnauthorizedVideosRequest = 
{
    request: {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        mode: 'cors',
        cache: 'default',
        secure: true,
    },
    uriExtenstion: 'videoUnauthorized'
}

// request to fetch comments
// used in VideoArea
export const postUnauthorizedCommentsRequest = 
{
    request: {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        mode: 'cors',
        cache: 'default',
        secure: true,
    },
    uriExtenstion: 'commentUnauthorized'
}

// used in useFetchWithPagination
export const postUnauthorizedRequest = ({ request, body, setDataArray }) => {
    const formedRequest = new Request(URI + request.uriExtenstion, {
        ...request.request,
        body: JSON.stringify(body)
    })

    const callback = (response) => {
        response.status === 200 ? response.json().then(result => setDataArray(result)) : response.json().then(result => console.log(result.message))
    }

    DataFetch({ request: formedRequest, callback: callback })
}

// authorized post comment request
// used in CommentsArea
export function PostComment(props) {
    const { AccessToken, CommentData } = props
    const headers = new Headers({ "Authorization": 'Bearer ' + AccessToken, "Content-Type": "application/json" })
    const request = new Request(URI + 'commentAuthorized', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(CommentData),
        mode: 'cors',
        cache: 'default',
        secure: true,
    })
    const callback = (response) => {
        console.log(response.status)
    }

    DataFetch({ request: request, callback: callback }) 
}

// delete comment
// used in CommentMenu
export function DeleteComment(props) {
    const { AccessToken, body } = props
    const headers = new Headers({ "Authorization": 'Bearer ' + AccessToken, "Content-Type": "application/json" })
    const request = new Request(URI + 'commentAuthorized', {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify(body),
        mode: 'cors',
        cache: 'default',
        secure: true,
    })
    const callback = (response) => {
        console.log(response.status)
    }

    DataFetch({ request: request, callback: callback }) 
}

export function RefreshToken(ChangeUser) {
    const headers = new Headers({ "Content-Type": "application/json" })
    const request = new Request(URI + 'refresh', {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default',
        secure: true,
        credentials: 'include'
    })
    const callback = (response) => {
        response.status === 401 ? ChangeUser(null) : response.json().then(result => getIdToken(result.accessToken, ChangeUser))
    }

    DataFetch({ request: request, callback: callback })
}

// fetch name, fullname, and avatar fields for all non admin users from the DB
// used in FetchUsersList
export function getAllUsers(setUsers) {
    const headers = new Headers({ "Content-Type": "application/json" })
    const request = new Request(URI + 'userUnauthorized', {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default',
        secure: true
    })
    const callback = (response) => {
        response.status !== 200 ? setUsers(null) : response.json().then(result => setUsers(result))
    }

    DataFetch({ request: request, callback: callback })
}

// authorize as one of the default users from the list using default password
// used in FetchUsersList
export function authDefaultUser(credentials, ChangeUser) {
    const headers = new Headers({ "Content-Type": "application/json" })
    const request = new Request(URI + 'auth', {
        method: 'POST',
        headers: headers,
        mode: 'cors',
        cache: 'default',
        secure: true,
        body: JSON.stringify({
            "username": credentials.username,
            "password": credentials.password
        }),
        credentials: 'include'
    })
    const callback = (response) => {
        response.status !== 200 ? ChangeUser(null) : window.location.reload()
    }

    DataFetch({ request: request, callback: callback })
}

export function getIdToken(AccessToken, ChangeUser) {
    const headers = new Headers({ "Authorization": 'Bearer ' + AccessToken })
    const request = new Request(URI + 'userAuthorized', {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default',
        secure: true,
    })
    const callback = async (response) => {
        response.json().then(IdToken => ChangeUser({ "accessToken": AccessToken, ...IdToken }));
    }

    DataFetch({ request: request, callback: callback })
}

// updates authorized user's data
// used in AvatarMenu
export function updateUserData(props) {
    const { AccessToken, UpdateFields } = props
    const headers = new Headers({ "Authorization": 'Bearer ' + AccessToken, "Content-Type": "application/json" })
    const request = new Request(URI + 'userAuthorized', {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(UpdateFields),
        mode: 'cors',
        cache: 'default',
        secure: true,
    })
    const callback = async (response) => {
        window.location.reload()
    }

    DataFetch({ request: request, callback: callback })
}

// logout, refresh token removal
// used in UserMenu
export function logout() {
    const headers = new Headers({ })
    const request = new Request(URI + 'logout', {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default',
        secure: true,
        credentials: 'include'
    })
    const callback = (response) => {
        response.status !== 500 ? window.location.reload() : console.log('Cannot access the API')
    }

    DataFetch({ request: request, callback: callback })
}

// post new video object into DB
// used in VideoFormLeft
export function createNewVideo(props) {
    const { AccessToken, VideoData } = props
    const headers = new Headers({ "Authorization": 'Bearer ' + AccessToken, "Content-Type": "application/json" })
    const request = new Request(URI + 'videoAuthorized', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(VideoData),
        mode: 'cors',
        cache: 'default',
        secure: true,
    })
    const callback = (response) => {
        console.log(response.status)
    }

    DataFetch({ request: request, callback: callback })
}