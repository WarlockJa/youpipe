import "./headermenu.scss";
import Icon from "../../Assets/tubes.png";
import { useTheme, useThemeUpdate } from "../../ContextProviders/ThemeContext";
import {
  useAuthUpdateData,
  useAuthData,
} from "../../ContextProviders/AuthContext";
import Icons from "../../Assets/icons";
import { useCallback, useEffect, useState } from "react";
import {
  refreshTokenRequest,
  getIdTokenRequest,
  postUnauthorizedRequest,
  postUnauthorizedVideosRequest,
} from "../../Utils/API/RequestsLibrary";
import UserLogged from "./Right/UserLogged/UserLogged";
import Login from "./Right/Login/Login";
import MenuProvider from "../../ContextProviders/MenuContext";
import useLoadingHook from "../../Utils/API/useLoadingHook";
import LoadingPlug from "../../Utils/LoadingPlug";
import { useQuery, useQueryUpdate } from "../../ContextProviders/QueryContext";
import {
  useSideMenu,
  useSideMenuUpdate,
} from "../../ContextProviders/SideMenuContext";
import { useVideo, useVideoUpdate } from "../../ContextProviders/VideoContext";
import useEventOutsideListener from "../../Utils/useEventOutsideListener";

export default function HeaderMenu() {
  // theme context
  const darkTheme = useTheme();
  const ChangeTheme = useThemeUpdate();
  // user data context
  const userData = useAuthData();
  const ChangeUser = useAuthUpdateData();
  // query context
  const query = useQuery();
  const ChangeQuery = useQueryUpdate();
  // side menu context
  const sideMenuOptions = useSideMenu();
  const ChangeSideMenu = useSideMenuUpdate();
  // video context
  const video = useVideo();
  const ChangeVideo = useVideoUpdate();
  // search bar value for search queries
  const [searchInput, setSearchInput] = useState("");

  // callback for fetched Access Token, using it to make an authorized request to fetch Id Token
  const callbackGetAccessToken = (AccessToken) => {
    ChangeUser(() => AccessToken);
    getIdToken.apiRequest(getIdTokenRequest(AccessToken.accessToken));
  };

  // callback for Id Token fetching and URI on load processing
  const callbackGetIdToken = (IdToken) => {
    // completing auth context
    ChangeUser((prev) => ({ ...prev, ...IdToken }));

    // processing authorized URI requests
    const queryParameters = new URLSearchParams(window.location.search);
    const paramLiked = queryParameters.get("liked");
    const paramSubscribed = queryParameters.get("subs");

    // fetching liked video request from the URI
    paramLiked &&
      ChangeQuery({
        amountToFind: query.defaults.amountToFind,
        fieldToSortBy: query.defaults.fieldToSortBy,
        query: { type: "liked", field: IdToken.activity.likes },
        defaults: query.defaults,
      });

    // fetching subscribed video request from the URI
    paramSubscribed &&
      ChangeQuery({
        amountToFind: query.defaults.amountToFind,
        fieldToSortBy: query.defaults.fieldToSortBy,
        query: { type: "author", field: IdToken.activity.subscriptions },
        defaults: query.defaults,
      });

    //setting up user's theme preference
    ChangeTheme(IdToken.darktheme);
  };

  // using loading hook to display loading screen on user data fecth during first loading
  const getAccessToken = useLoadingHook({ callback: callbackGetAccessToken });
  const getIdToken = useLoadingHook({ callback: callbackGetIdToken });

  // on site load check if Refresh Token present and use it to fetch data
  // and process URI requests
  useEffect(() => {
    getAccessToken.apiRequest(refreshTokenRequest);

    // processing unauthorized URI inputs
    const queryParameters = new URLSearchParams(window.location.search);
    const paramVideo = queryParameters.get("v");
    const paramSearch = queryParameters.get("search");
    const paramTags = queryParameters.get("tags");

    // search query in URI
    paramSearch &&
      ChangeQuery({
        amountToFind: query.defaults.amountToFind,
        fieldToSortBy: null,
        query: { type: "search", field: decodeURI(paramSearch) },
        defaults: query.defaults,
      });

    // callback for URI video fetch
    const videoURIcallback = (result) => {
      ChangeVideo({
        active: true,
        element: result.result[0],
        amountToFind: 40,
        defaults: video.defaults,
      });
      let randomTagsArray = [];
      // selecting a random N=1 number of tags from the list
      [...Array(1)].map((_item) =>
        randomTagsArray.push(
          result.result[0].tags[
            Math.floor(Math.random() * result.result[0].tags.length)
          ]
        )
      );
      // making the request array unique
      ChangeQuery({
        amountToFind: query.defaults.amountToFind,
        fieldToSortBy: query.defaults.fieldToSortBy,
        query: { type: "tags", field: randomTagsArray },
        defaults: query.defaults,
      });
    };

    // processing video URI request
    const body = {
      amountToFind: 1,
      query: { type: "video", field: decodeURI(paramVideo) },
    };
    paramVideo &&
      postUnauthorizedRequest({
        body: body,
        request: postUnauthorizedVideosRequest,
        setDataArray: videoURIcallback,
      });

    // tags query in URI
    paramTags &&
      ChangeQuery({
        amountToFind: query.defaults.amountToFind,
        fieldToSortBy: query.defaults.fieldToSortBy,
        query: {
          type: "tags",
          field: decodeURI(paramTags)
            .split(" ")
            .map((item) => item)
            .filter((item) => item !== "All"),
        },
        defaults: query.defaults,
      });
  }, []);

  // processing popstate change
  const handlePopstateEvent = useCallback((event) => {
    window.location.reload();
  }, []);

  useEventOutsideListener("popstate", handlePopstateEvent, "window");

  // executing search
  const handleSearchClick = (searchString) => {
    window.history.pushState(
      "search",
      "",
      process.env.REACT_APP_YOUPIPE_URI + "?search=" + encodeURI(searchString)
    );
    if (searchString) {
      ChangeVideo({ ...video.defaults, defaults: video.defaults });
      ChangeQuery({
        amountToFind: query.defaults.amountToFind,
        fieldToSortBy: null,
        query: { type: "search", field: searchString },
        defaults: query.defaults,
      });
    }
  };

  // catching enter pressed as search submit event
  const handleSearchbarKeyDown = (e) => {
    if (e.key === "Enter") handleSearchClick(searchInput);
  };

  return (
    <div className="headerMenu" darktheme={darkTheme ? 1 : 0}>
      <div className="headerMenu-left">
        <div
          className="headerMenu-left-sidemenuButton"
          onClick={() =>
            ChangeSideMenu({
              ...sideMenuOptions,
              sideMenuFolded: !sideMenuOptions.sideMenuFolded,
            })
          }
        >
          <div className="buttonLine" id="line1"></div>
          <div className="buttonLine" id="line2"></div>
          <div className="buttonLine" id="line3"></div>
        </div>
        <div
          className="headerMenu-left-logo"
          title="YouPipe Home"
          onClick={() =>
            window.location.replace(process.env.REACT_APP_YOUPIPE_URI)
          } // url of the youpipe
        >
          <img src={Icon} alt="" />
          YouPipe
        </div>
      </div>

      <div className="headerMenu-center">
        <div className="headerMenu-searchBar">
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => handleSearchbarKeyDown(e)}
          />
          <div
            className="searchButton"
            onClick={() => handleSearchClick(searchInput)}
          >
            <Icons.Loupe />
          </div>
        </div>
      </div>

      <div className={"headerMenu-right"}>
        <MenuProvider>
          {getAccessToken.isLoading ||
          (!getAccessToken.isError && getIdToken.isLoading) ? (
            <LoadingPlug darktheme={darkTheme} />
          ) : userData ? (
            <UserLogged />
          ) : (
            <Login />
          )}
        </MenuProvider>
      </div>
    </div>
  );
}
