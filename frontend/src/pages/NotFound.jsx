import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-base-200 text-center">
      <h1 className="text-7xl font-bold text-primary">404</h1>
      <h2 className="text-3xl font-semibold mt-4">Oops! Page Not Found</h2>
      <p className="text-lg mt-2 text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary mt-6">
        Back to Home
      </Link>
      
    </div>
  );
};

export default NotFound;
