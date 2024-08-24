"use client";
import { useContext, useState } from "react";
import ToggleTheme from "../ToggleTheme";
import { menuItems, MenuItem } from "./helpers/menuItems";
import { useRouter } from "next/navigation";
import { UserContext, UserContextType } from "../Store";

function NavBar() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { user, setUser } = useContext(UserContext) as UserContextType;

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const handleMouseEnter = (name: string) => {
    setActiveMenu(name);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const renderNavBarMenuItems = (
    menuItems: MenuItem[],
    isSidebar: boolean = false
  ) => {
    return menuItems.map((item, index) => {
      if (item.hide?.includes("logged-in") && user?.id) {
        return undefined;
      } else if (item.hide?.includes("logged-out") && !user?.id) {
        return undefined;
      } else {
        return (
          <li key={item.name + index} className="relative">
            <a
              onClick={() => handleNavigation(item.route)}
              onMouseEnter={() => !isSidebar && handleMouseEnter(item.name)}
              onMouseLeave={() => !isSidebar && handleMouseLeave()}
              className="cursor-pointer"
            >
              {item.name}
            </a>
            {item.children &&
              item.children.length > 0 &&
              (isSidebar ? (
                <ul className="pl-4" key={item.name + "child-ul" + index}>
                  {item.children.map((child, index) => (
                    <li key={child.name + index}>
                      <a
                        onClick={() => handleNavigation(child.route)}
                        className="cursor-pointer"
                      >
                        {child.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                activeMenu === item.name && (
                  <ul
                    className="absolute bg-base-200 p-2 shadow-lg"
                    style={{ left: 0, top: "100%" }}
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                    key={item.name + "child-ul" + index}
                  >
                    {item.children.map((child, index) => (
                      <li key={child.name + index}>
                        <a
                          onClick={() => handleNavigation(child.route)}
                          className="cursor-pointer"
                        >
                          {child.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )
              ))}
          </li>
        );
      }
    });
  };

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="w-full navbar bg-base-300">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div
            className="flex-1 px-2 mx-2 flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            <img src="/icon.png" alt="Stock Pilot Logo" className="w-8 h-8" />
            <span className="text-2xl">Stock Pilot</span>
          </div>
          <ToggleTheme />
          <div className="flex-none hidden lg:block">
            <ul className="menu menu-horizontal">
              {renderNavBarMenuItems(menuItems)}
            </ul>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          {renderNavBarMenuItems(menuItems, true)}
        </ul>
      </div>
    </div>
  );
}

export default NavBar;
