import { useAuth } from "../context/AuthContext";
import ProfileImage from "../utils/ProfileImage";
import { LogOut, User2 } from "lucide-react";
import React from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { name, role, id } = user || {}; // Destructure safely

  return (
    <div className="navbar bg-white-200 shadow-md">
      <div className="navbar-start">
     
        <a href="/" className="btn btn-ghost text-3xl">TestPrep</a>
      </div>

      <div className="navbar-end">
        {name ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                {name ? <ProfileImage name={name} /> : <div>Loading profile...</div>}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <a className="justify-between">
                  <User2 />
                  {name}
                </a>
              </li>
              <li>
                <a onClick={logout} className="justify-between cursor-pointer">
                  <LogOut /> Logout
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <a className="btn btn-primary" href="/login">Login</a>
        )}
      </div>
    </div>
  );
};

export default Navbar;
