import { useEffect, useState } from "react"
import { authDefaultUser, getAllUsers } from "./RequestsLibrary"
import LoadingPlug from "../LoadingPlug"

export default function FetchUsersList (props) {
    const { menuItem, ChangeUser } = props
    const [ usersList, setUsersList ] = useState(null)

    useEffect(() => {
        if (menuItem) {
            console.log('Users fetched')
            getAllUsers(setUsersList);
        }
    },[menuItem])

    if(usersList !== null) {
        return usersList.map((person, index) => {
            return (
                <div
                    key={index}
                    className='userInfo'
                    onClick={() => {
                        authDefaultUser({ username: person.name, password: process.env.REACT_APP_DEFAULT_PASSWORD }, ChangeUser)
                    }}
                >
                    <img src={person.avatar} alt="" />
                    <p>{person.name}</p>
                    <p>{person.fullname}</p>
                </div>
            )
        })
    } else { return <LoadingPlug /> }
}