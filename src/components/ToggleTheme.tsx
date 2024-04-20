"use client";
import { useState, useEffect } from "react";

function ToggleTheme() {
  const [theme, setTheme] = useState<"dark" | "cmyk">("dark");
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "cmyk" : "dark");
  };
  useEffect(() => {
    const userThemePreference = localStorage.getItem("stock-pilot-theme");
    if (userThemePreference === "cmyk") {
      setTheme("cmyk");
      document.querySelector("html")?.setAttribute("data-theme", "cmyk");
    }
  }, []);
  // initially set the theme and "listen" for changes to apply them to the HTML tag
  useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
    localStorage.setItem("stock-pilot-theme", theme);
  }, [theme]);
  return (
    <label className="swap swap-rotate">
      <input onClick={toggleTheme} type="checkbox" />
      <div className="swap-on">DARKMODE</div>
      <div className="swap-off">LIGHTMODE</div>
    </label>
  );
}

export default ToggleTheme;
