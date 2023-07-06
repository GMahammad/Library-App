import { useOktaAuth } from "@okta/okta-react";
import { NavLink } from "react-router-dom";

const Footer = () => {

  const { authState } = useOktaAuth();
  
  return (
    <div style={{background:"rgb(219, 146, 11)"}}>
      <footer
        className="container d-flex flex-wrap 
        justify-content-between align-items-center py-5 main-color"
      >
        <p className="col-md-4 mb-0 text-white">© Example Library App, Inc</p>
        <ul className="nav navbar-dark col-md-4 justify-content-end">
          <li className="nav-item">
            <NavLink to="/home" className="nav-custom nav-link text-white px-2 ">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/search" className="nav-custom nav-link px-2 text-white">
              Search Books
            </NavLink>
          </li>
          {authState && authState.isAuthenticated && (
            <li className="nav-item">
              <NavLink className="nav-custom nav-link px-2 text-white" to="/shelf">
                My Shelf
              </NavLink>
            </li>
          )}
          {authState && authState.isAuthenticated && (
            <li className="nav-item">
              <NavLink className="nav-custom nav-link px-2 text-white" to="/libraryservice">
                Library Service
              </NavLink>
            </li>
          )}
        </ul>
      </footer>
    </div>
  );
};

export default Footer;
