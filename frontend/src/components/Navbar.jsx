import { useAuth } from "../context/AuthContext";
import ProfileImage from "../utils/ProfileImage";
import { LogOut, User2 } from "lucide-react";
import React from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { name, role, id } = user || {};

  return (
    <div className="navbar bg-base-100 sticky top-0 z-40">
      <div className="navbar-start">
      <div className="dropdown z-50">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
             <li><a href="/#about">About</a></li>
             <li><a href="/#contact">Contact</a></li>
          </ul>
        </div>
        <a href="/" className="btn btn-ghost text-3xl">TestPrep</a>
      </div>

      <div className="navbar-center hidden lg:flex">
        
        <ul className="menu menu-horizontal px-1">
          <li><a href="/#about">About</a></li>
          <li><a href="/#contact">Contact</a></li>
        </ul>
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
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
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
