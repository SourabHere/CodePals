import { Link } from "react-router-dom";
import "./navbar/style.css";

const Navbar = ({ triggerSetActiveList, activeList }) => {
  const handleClick = (index) => {
    triggerSetActiveList(index);
  };

  return (
    <div className="mainNav">
      <div className="contents">
        <ul className="navlists">
          <li onClick={() => handleClick(0)}>
            <Link to="/home/dashboard" className="links">
              <div className="navwrap">
                <div className={`Nav ${activeList === 0 ? "active" : ""}`}>
                  <p>Dashboard</p>
                </div>
                <div
                  className={`whiteSpace ${activeList === 0 ? "active" : ""}`}
                ></div>
              </div>
            </Link>
          </li>

          <li onClick={() => handleClick(1)}>
            <Link to="/home/profile" className="links">
              <div className="navwrap">
                <div className={`Nav ${activeList === 1 ? "active" : ""}`}>
                  <p>Profile</p>
                </div>
                <div
                  className={`whiteSpace ${activeList === 1 ? "active" : ""}`}
                ></div>
              </div>
            </Link>
          </li>

          <li onClick={() => handleClick(2)}>
            <Link to="/home/settings" className="links">
              <div className="navwrap">
                <div className={`Nav ${activeList === 2 ? "active" : ""}`}>
                  <p>Settings</p>
                </div>
                <div
                  className={`whiteSpace ${activeList === 2 ? "active" : ""}`}
                ></div>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
