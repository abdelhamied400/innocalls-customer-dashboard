"use client";
import useAppStore from "@/store/app.slice";
import LocaleSwitcher from "./LocaleSwitcher";
import ProfileMenu from "./ProfileMenu";
import { Button } from "./ui/button";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useTranslations } from "next-intl";

const AppNavbar = () => {
  const t = useTranslations("sidebar");
  const { isSidebarOpen, toggleSidebar, pageTitle } = useAppStore();

  return (
    <nav className="navbar">
      <div className="flex justify-between items-center gap-8 px-4 border-b-2 h-24">
        <div className="flex items-center gap-2">
          {!isSidebarOpen && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <MenuOpenIcon />
            </Button>
          )}

          <h1>{pageTitle || t("navigation.dashboard")}</h1>
        </div>
        <div className="flex items-center gap-4 actions">
          <LocaleSwitcher />
          <ProfileMenu />
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
