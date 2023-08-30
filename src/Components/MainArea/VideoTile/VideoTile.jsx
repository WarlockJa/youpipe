import "./videotile.scss";
import StumpImage from "../../../Assets/stumpimage.png";
import {
  useVideo,
  useVideoUpdate,
} from "../../../ContextProviders/VideoContext";
import {
  useSideMenu,
  useSideMenuUpdate,
} from "../../../ContextProviders/SideMenuContext";
import { RefreshToken } from "../../../Utils/API/RequestsLibrary";
import {
  useAuthData,
  useAuthUpdateData,
} from "../../../ContextProviders/AuthContext";
import {
  useQuery,
  useQueryUpdate,
} from "../../../ContextProviders/QueryContext";
import TimeParser from "../../../Utils/TimeParser";
import { useTheme } from "../../../ContextProviders/ThemeContext";
import { useState } from "react";
import Spinner from "../../../Utils/Spinner";

export default function VideoTile(props) {
  const { element } = props;
  // theme context
  const darkTheme = useTheme();
  // video context
  const video = useVideo();
  const ChangeVideo = useVideoUpdate();
  // side menu context
  const sideMenuOptions = useSideMenu();
  const ChangeSideMenu = useSideMenuUpdate();
  // auth context
  const userData = useAuthData();
  const ChangeUser = useAuthUpdateData();
  // query context
  const query = useQuery();
  const ChangeQuery = useQueryUpdate();
  // image loaded state
  const [loaded, setLoaded] = useState(false);

  // returning stump tile to fill up unfinished row
  if (!element)
    return (
      <div className="videoTile video-tile-stump">
        <div className="videoTile-imageArea">
          <img src={StumpImage} alt="" />
        </div>
      </div>
    );

  // passed video slide information
  const { author, avatar, previewImage, title, uploaded, views, _id } = element;

  _id === "63b66b8f01c5f96ba7926d41" && console.log(loaded);

  const handleVideoTileClick = () => {
    // changing URI for the video
    window.history.pushState(
      "video",
      "",
      process.env.REACT_APP_YOUPIPE_URI + "?v=" + encodeURI(_id)
    );
    // refreshing Access Token for the user
    if (userData) RefreshToken(ChangeUser);
    // Switching to another slide
    ChangeVideo({
      active: true,
      element: element,
      amountToFind: 40,
      loading: true,
      defaults: video.defaults,
    });
    // Folding side menu for video mode
    ChangeSideMenu({ ...sideMenuOptions, sideMenuFolded: true });
    // changing query for the main area based on the tags of the selected slide
    let randomTagsArray = [];
    // selecting a random N=1 number of tags from the list
    [...Array(1)].map((_item) =>
      randomTagsArray.push(
        element.tags[Math.floor(Math.random() * element.tags.length)]
      )
    );
    // making the request array unique
    // randomTagsArray = [...new Set(randomTagsArray.map(item => item))]
    ChangeQuery({
      amountToFind: query.defaults.amountToFind,
      fieldToSortBy: query.defaults.fieldToSortBy,
      query: { type: "tags", field: randomTagsArray },
      defaults: query.defaults,
    });
  };

  return (
    <div
      className="videoTile"
      darktheme={darkTheme ? 1 : 0}
      onClick={() => handleVideoTileClick()}
    >
      <div className="videoTile-imageArea">
        <img src={previewImage} alt="" onLoad={() => setLoaded(true)} />
        {/* {!loaded && (
          <div className="videotileloading">
            <Spinner />
          </div>
        )} */}
      </div>
      <div className="videoTile-videoDescription">
        <div className="videoDescription-userIcon">
          <img src={avatar} alt="" />
        </div>
        <div className="videoDescription-description">
          <h2 title={title}>{title}</h2>
          <h3>{author}</h3>
          <h3>
            {views} • {TimeParser(uploaded)}
          </h3>
        </div>
      </div>
    </div>
  );
}
