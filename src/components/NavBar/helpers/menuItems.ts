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
    name: "Stocks",
    route: "/stocks",
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
    },
    {
      name: "Sold Shares",
      route: "/sold-shares",
      hide: ["logged-out"],
    }],
  },
  { name: "Sign Up", route: "/sign-up", hide: ["logged-in"] },
  { name: "Log In", route: "/login", hide: ["logged-in"] },
];
