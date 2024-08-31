interface MenuItemChild {
  name: string;
  route: string;
  hide?: ("logged-in" | "logged-out")[];
}

export interface MenuItem {
  name: string;
  route: string;
  hide?: ("logged-in" | "logged-out")[];
  children?: MenuItemChild[];
}

export const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    route: "/dashboard",
    hide: ["logged-out"],
    children: [],
  },
  {
    name: "Trades",
    route: "",
    hide: ["logged-out"],
    children: [{
      name: "Purchased Shares",
      route: "/purchased-shares",
      hide: ["logged-out"],
    }],
  },
  {
    name: "My Profile",
    route: "/my-profile",
    hide: ["logged-out"],
    children: [],
  },
  { name: "Sign Up", route: "/sign-up", hide: ["logged-in"] },
  { name: "Log In", route: "/login", hide: ["logged-in"] },
];
