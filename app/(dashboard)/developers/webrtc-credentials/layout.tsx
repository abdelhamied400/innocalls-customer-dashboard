import { PropsWithChildren } from "react";

type WebrtcCredentialsLayoutProps = PropsWithChildren<{
  createSheet: React.ReactNode;
  editSheet: React.ReactNode;
}>;

const WebrtcCredentialsLayout = ({ children, createSheet, editSheet }: WebrtcCredentialsLayoutProps) => {
  return (
    <>
      {children}
      {createSheet}
      {editSheet}
    </>
  );
};

export default WebrtcCredentialsLayout;
