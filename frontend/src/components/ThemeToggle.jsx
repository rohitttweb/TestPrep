import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const themes = [
    "light",
    "lofi",
    "winter",
    "dim",
    "nord",
 
  ];
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem("theme") || "deafult"; // Load saved theme, default to "default"
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("theme", selectedTheme); // Save theme preference
  }, [selectedTheme]);

  return (
    <div className="dropdown dropdown-top fixed bottom-5 left-5 z-50">
      <div tabIndex={0} role="button" className="btn m-1">
        Theme
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048">
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>

      <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl">
        {themes.map((theme) => (
          <li key={theme}>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
              aria-label={theme}
              value={theme}
              checked={selectedTheme === theme}
              onChange={() => setSelectedTheme(theme)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
