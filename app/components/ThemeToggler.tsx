"use client";
import { useTheme } from "next-themes";
import { PiMoonStarsFill, PiSunFill } from "react-icons/pi";

export default function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? (
        <PiSunFill size={30} />
      ) : (
        <PiMoonStarsFill size={30} />
      )}
    </button>
  );
}
