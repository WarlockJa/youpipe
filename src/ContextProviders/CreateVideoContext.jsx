import React, { useContext, useState } from 'react';

const CreateVideoContext = React.createContext({
    title: '',
    description: '',
    avatar: '',
    rating: { likes: 0, dislikes: 0 },
    image: '/Assets/defaultImage.png',
    previewImage: '/Assets/defaultImage.png',
    views: 0,
    tags: [],
    errors: { image: false, title: false },
    defaults: {
        title: '',
        description: '',
        avatar: '',
        rating: { likes: 0, dislikes: 0 },
        image: '/Assets/defaultImage.png',
        previewImage: '/Assets/defaultImage.png',
        views: 0,
        tags: [],
        errors: { image: false, title: false },
    }
})
const CreateVideoUpdateContext = React.createContext()

export function useCreateVideoData() {
    return useContext(CreateVideoContext)
}

export function useCreateVideoUpdateData() {
    return useContext(CreateVideoUpdateContext)
}

export default function CreateVideoProvider({ children }) {
    const [createVideoData, setCreateVideoData] = useState({
        title: '',
        description: '',
        avatar: '',
        rating: { likes: 0, dislikes: 0 },
        image: '/Assets/defaultImage.png',
        previewImage: '/Assets/defaultImage.png',
        views: 0,
        tags: [],
        errors: { image: false, title: false },
        defaults: {
            title: '',
            description: '',
            avatar: '',
            rating: { likes: 0, dislikes: 0 },
            image: '/Assets/defaultImage.png',
            previewImage: '/Assets/defaultImage.png',
            views: 0,
            tags: [],
            errors: { image: false, title: false },
        }
    })

    function ChangeCreateVideo(newCreateVideoData) {
        setCreateVideoData(newCreateVideoData)
    }

    return (
        <CreateVideoContext.Provider value={createVideoData}>
            <CreateVideoUpdateContext.Provider value={ChangeCreateVideo}>
                {children}
            </CreateVideoUpdateContext.Provider>
        </CreateVideoContext.Provider>
    )
}
