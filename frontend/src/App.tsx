import { Outlet } from "react-router-dom";
import "./App.css";
import { NavBar } from "./components/NavBar";
import { SideBar } from "./components/SideBar";
import { useEffect, useRef, useState } from "react";
import { getConnectedUser, verifyToken } from "./queries";
import type { User } from "./types";

export interface contextType {
  connectedUser: User;
  hideSideBar: boolean;
  onLargeScreen: boolean;
  onPageTransition: () => void;
  onSmallScreen: boolean;
  isUserConnected: boolean;
  handleUserLogout: () => void;
}

function App() {
  const [isUserConnected, setIsUserConnected] = useState(false);
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
      const user = await getConnectedUser(
        localStorage.getItem("dadinaut_blogging_platform_auth_token"),
      );
      setConnectedUser(user);
    })();
  }, []);

  const handleUserLogout = async () => {
    setIsUserConnected(false);
    const user = await getConnectedUser(
      localStorage.getItem("dadinaut_blogging_platform_auth_token"),
    );
    setConnectedUser(user);
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem(
        "dadinaut_blogging_platform_auth_token",
      );
      if (!token) return setIsUserConnected(false);
      const status = await verifyToken(token);

      if (status === 200) {
        setIsUserConnected(true);
      } else {
        setIsUserConnected(false);
      }
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
        <SideBar
          onUserLogout={handleUserLogout}
          onLargeScreen={onLargeScreen}
          hideSideBar={hideSideBar}
        />
        <Outlet
          context={{
            connectedUser,
            hideSideBar,
            onLargeScreen,
            onPageTransition,
            onSmallScreen,
            isUserConnected,
            handleUserLogout,
          }}
        />
      </div>
    </div>
  );
}

export default App;
