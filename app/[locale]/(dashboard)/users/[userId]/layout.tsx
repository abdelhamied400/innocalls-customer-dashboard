import { PropsWithChildren } from "react";

type UsersLayoutProps = PropsWithChildren<{
  editSheet: React.ReactNode;
}>;
const UserLayout = ({ children, editSheet }: UsersLayoutProps) => {
  return (
    <div className="users-layout bg-white rounded-xl h-full flex flex-col gap-3 p-4">
      {editSheet}
      {children}
    </div>
  );
};

export default UserLayout;
