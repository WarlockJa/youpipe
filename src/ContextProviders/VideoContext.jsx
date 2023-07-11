import React, { useContext, useState } from "react";

const VideoContext = React.createContext();
const VideoUpdateContext = React.createContext({
  active: false,
  element: {},
  amountToFind: 0,
  loading: true,
  defaults: { active: false, element: {}, amountToFind: 0, loading: true },
});

export function useVideo() {
  return useContext(VideoContext);
}

export function useVideoUpdate() {
  return useContext(VideoUpdateContext);
}

export default function VideoProvider({ children }) {
  const [video, setVideo] = useState({
    active: false,
    element: {},
    amountToFind: 0,
    loading: true,
    defaults: { active: false, element: {}, amountToFind: 0, loading: true },
  });

  function ChangeVideo(newValue) {
    setVideo(newValue);
  }

  return (
    <VideoContext.Provider value={video}>
      <VideoUpdateContext.Provider value={ChangeVideo}>
        {children}
      </VideoUpdateContext.Provider>
    </VideoContext.Provider>
  );
}
