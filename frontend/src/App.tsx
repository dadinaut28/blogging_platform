import { Outlet } from "react-router-dom";
import "./App.css";
import { NavBar } from "./components/NavBar";
import { SideBar } from "./components/SideBar";
import { useEffect, useRef, useState } from "react";
import { getConnectedUser } from "./queries";
import type { User } from "./types";

export interface contextType {
  connectedUser: User;
  hideSideBar: boolean;
  onLargeScreen: boolean;
  onPageTransition: () => void;
  onSmallScreen: boolean;
}

function App() {
  const [connectedUser, setConnectedUser] = useState();
  const appRef = useRef<null | HTMLDivElement>(null);
  const [hideSideBar, setHideSideBar] = useState(false);
  const [onLargeScreen, setOnLargeScreen] = useState(false);
  const [onSmallScreen, setOnSmallScreen] = useState(false);
  // When going from one page to another
  const onPageTransition = () => {
    setHideSideBar(true);
  };

  useEffect(() => {
    (async () => {
      const user = await getConnectedUser();
      setConnectedUser(user);
    })();
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      if (Number(entry.contentRect.width) > 995) {
        setOnLargeScreen(true);
        setHideSideBar(false);
      } else if (entry.contentRect.width < 995) {
        if (onLargeScreen) setHideSideBar(true);
        setOnLargeScreen(false);
      }
      console.log("On small screen: ", onSmallScreen);
      if (entry.contentRect.width < 855) {
        setOnSmallScreen(true);
      } else if (entry.contentRect.width > 855) {
        setOnSmallScreen(false);
      }
    });
    if (appRef.current) {
      observer.observe(appRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hideSideBar, onLargeScreen, onSmallScreen]);

  const handleHamburgerClick = () => {
    setHideSideBar((v) => {
      console.log(v);
      return !v;
    });
  };

  return (
    <div ref={appRef}>
      <NavBar
        onLargeScreen={onLargeScreen}
        onHamburgerClick={handleHamburgerClick}
        onSmallScreen={onSmallScreen}
      />
      <div className="flex mt-14">
        <SideBar onLargeScreen={onLargeScreen} hideSideBar={hideSideBar} />
        <Outlet
          context={{
            connectedUser,
            hideSideBar,
            onLargeScreen,
            onPageTransition,
            onSmallScreen,
          }}
        />
      </div>
    </div>
  );
}

export default App;
