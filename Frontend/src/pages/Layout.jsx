import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./styles/Dashboard.css";
import Navbar from "../components/Navbar";
import { FcSettings } from "react-icons/fc";

import { SignedIn, SignedOut, UserButton, SignIn } from "@clerk/clerk-react";

import { useState } from "react";

const Layout = () => {
  const [activeList, setActiveList] = useState(0);

  const triggerSetActiveList = (index) => {
    setActiveList(index);
  };

  return (
    <div className="main">
      <div className="outer">
        <div className="fullBox">
          <div className="topBox">
            <div className="leftContent">
              <div className="logoContainer">
                <img
                  className="dashboardPageLogo"
                  src="/CodePalsSloBLess.png"
                  alt="code-sync"
                />
              </div>
            </div>
            <div className="midContent">{/* <h1>Mid Content</h1> */}</div>
            <div className="rightContent">
              <ul className="buttonList">
                <li className="btns">
                  <div>
                    <Link to="/home/settings">
                      <button
                        className="settings topbutton"
                        onClick={() => {
                          triggerSetActiveList(2);
                        }}
                      >
                        <FcSettings />
                      </button>
                    </Link>
                  </div>
                </li>
                <li className="btns profilebtn">
                  <div>
                    <UserButton afterSignOutUrl="/home" />
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="midBox">
            <div className="Navbar leftBar">
              <Navbar
                triggerSetActiveList={triggerSetActiveList}
                activeList={activeList}
              />
            </div>
            <div className="RightBox">
              <SignedOut>
                <div className="signinBox">
                  <div className="sigininComponent">
                    <SignIn fallbackRedirectUrl="/home/dashboard" />
                  </div>
                </div>
              </SignedOut>
              <SignedIn>
                <Outlet />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
