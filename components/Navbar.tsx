import LocaleSwitcher from "./LocaleSwitcher";
import ProfileMenu from "./ProfileMenu";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="flex justify-between items-center gap-8 px-4 border-b-2 h-24">
        <h1>Dashboard</h1>
        <div className="flex items-center gap-4 actions">
          <LocaleSwitcher />
          <ProfileMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
