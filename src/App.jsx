import './app.scss';
import HeaderMenu from "./Components/HeaderMenu/HeaderMenu";
import MainArea from "./Components/MainArea/MainArea";
import SideMenu from "./Components/SideMenu/SideMenu";
import VideoArea from "./Components/VideoArea/VideoArea";
import ThemeProvider from "./ContextProviders/ThemeContext";
import AuthProvider from "./ContextProviders/AuthContext";
import QueryProvider from "./ContextProviders/QueryProvider";
import SideMenuProvider from "./ContextProviders/SideMenuContext";
import VideoProvider from './ContextProviders/VideoContext';

function App() {

  console.log('App render')
  return (
    <AuthProvider>
      <ThemeProvider>
        <QueryProvider>
            <SideMenuProvider>
              <VideoProvider>
                <HeaderMenu />
                <SideMenu />
                <div className="feedArea">
                  <VideoArea />
                  <MainArea />
                </div>
              </VideoProvider>
            </SideMenuProvider>
        </QueryProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
