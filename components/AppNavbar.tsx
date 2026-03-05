"use client";
import useAppStore from "@/store/app.slice";
import LocaleSwitcher from "./LocaleSwitcher";
import ProfileMenu from "./ProfileMenu";
import { ReactNode } from "react";

type AppNavbarProps = {
  navbarTitle: ReactNode;
};

const AppNavbar = ({ navbarTitle }: AppNavbarProps) => {
  return (
    <nav className="navbar">
      <div className="flex justify-between items-center gap-8 px-4 border-b-2 h-24">
        <div>{navbarTitle}</div>
        <div className="flex items-center gap-4 actions">
          <LocaleSwitcher />
          <ProfileMenu />
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
